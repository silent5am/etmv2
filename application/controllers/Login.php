<?php
defined('BASEPATH') or exit('No direct script access allowed');

final class Login extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->db->cache_off();
        $this->load->library('etmsession');
        $this->load->model('common/Msg');
        $this->load->library('twig');
    }

    /**
     * Attempts to login a user
     * @return void
     */
    public function process(): void
    {
        $username = $this->input->post('username', true);
        $password = $this->input->post('password', true);

        $data             = array();
        $data['SESSION']  = $_SESSION; // not part of MY_Controller
        $data['view']     = 'login/login_v';
        $data['username'] = $username;
        $data['password'] = $password;

        $this->load->model('Login_model', 'login');
        $this->load->model('common/Auth', 'auth');
        if ($this->auth->validateLogin($username, $password)) {
            //login success
            $user_data = $this->login->getUserData($username);
            $id_user   = $user_data->iduser;
            $email     = $user_data->email;

            $session_start = date('Y-m-d H:i:s');
            $session_data  = array("username" => $username,
                "start"                           => $session_start,
                "iduser"                          => $id_user,
                "email"                           => $email,
            );
            $this->etmsession->setData($session_data);
            redirect(base_url('Updater'));
        } else {
            buildMessage("error", Msg::INVALID_LOGIN);
            $data['no_header'] = 1;
            $this->twig->display('main/_template_v', $data);
        }
    }
}
