<?php
if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

require_once 'DB_model.php';

final class User_model extends DB_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    protected $table      = 'user';
    protected $alias      = 'u';
    protected $identifier = 'iduser';

    protected function parseOptions(array $options = [])
    {
        return parent::parseOptions($options);
    }
}