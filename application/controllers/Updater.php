<?php
ini_set('mysql.connect_timeout', '3000');
ini_set('default_socket_timeout', '3000');
ini_set('max_execution_time', '300');

defined('BASEPATH') or exit('No direct script access allowed');

class Updater extends CI_Controller
{
    private $user_id;

    public function __construct()
    {
        parent::__construct();
        $this->db->cache_off();
        $this->db->cache_delete_all();
        $this->load->library('session');
        $this->load->model('common/Msg');
        $this->load->model('common/Log');
        $this->load->model('common/ValidateRequest');
        $this->user_id = (int) $this->session->iduser;
    }

    public function index()
    {
        $username = $this->session->username;
        $view     = 'login/select_v';
        $this->load->model('Updater_model');

        $this->Updater_model->init($username);

        if (!$this->ValidateRequest->testEndpoint()) {
            buildMessage("error", Msg::XML_CONNECT_FAILURE, $view);
        } else if (!$this->Updater_model->processAPIKeys($username)) {
            log_message('error', 'errr');
            buildMessage("error", Msg::XML_CONNECT_FAILURE, $view);
        } else {
            if ($this->Updater_model->isLocked($username)) {
            } else {
                try {
                    $this->Updater_model->lock($username);
                    //catch the API acess violation bug
                    $result_iterate = $this->Updater_model->iterateAccountCharacters();

                    if ($result_iterate == "noChars") {
                        //in case user has no characters in account
                        $data['view']      = "login/select_nocharacter_v";
                        $data['no_header'] = 1;
                        buildMessage("error", Msg::LOGIN_NO_CHARS, $data['view']);
                        $this->load->view('main/_template_v', $data);
                        return;

                    } else if ($result_iterate == "dberror") {
                        //in case the transaction fails
                        buildMessage("error", Msg::DB_ERROR, "login/login_v");
                        $data['view']      = "login/login_v";
                        $data['no_header'] = 1;
                        $this->load->view('main/_template_v', $data);
                        return;
                    }


                } catch (\Pheal\Exceptions\PhealException $e) {
                    //in case the API throws an exception (usually a bug)
                    echo sprintf(
                        "an exception was caught! Type: %s Message: %s",
                        get_class($e),
                        $e->getMessage()
                    );


                    //remove cache and try again
                    $problematicKeys = $this->Updater_model->getAPIKeys($this->user_id);

                    foreach ($problematicKeys as $row) {
                        $key = $row->key;
                        $dir = FILESTORAGE . $key;
                        $this->removeDirectory($dir);
                        $this->Log->addEntry('clear', $this->user_id);
                        $this->Updater_model->release($username);
                    }
                    $this->index();
                }
            }

            //calculate profits
            $this->db->trans_start();
            $this->Updater_model->calculateProfits();
            //totals and history
            $this->Updater_model->updateTotals();
            $this->db->trans_complete();

            if ($this->db->trans_status() === false) {
                buildMessage("error", Msg::DB_ERROR, "login/login_v");

                $data['view']      = "login/login_v";
                $data['no_header'] = 1;
                $this->load->view('main/_template_v', $data);
                return;
            } else {
                $table = $this->Updater_model->resultTable($username);

                $this->Updater_model->release($username);
                $this->Log->addEntry('update', $this->user_id);
                
                //transaction success, show the result table
                //buildMessage("success", Msg::LOGIN_SUCCESS, $view);

                $data['cl']        = $this->Updater_model->getChangeLog();
                $data['cl_recent'] = $this->Updater_model->getChangeLog(true);
                $data['table']     = array($table);
                $data['view']      = "login/select_v";
                $data['no_header'] = 1;


                //$data['view']      = "login/select_nocharacter_v";
            }
            $this->load->view('main/_template_v', $data);
        }
    }

    private function removeDirectory(string $path)
    {
        if (is_dir($path)) {
            $files = glob($path . '/*');
            foreach ($files as $file) {
                is_dir($file) ? $this->removeDirectory($file) : unlink($file);
            }
            rmdir($path);
            return;
        }
    }
}
