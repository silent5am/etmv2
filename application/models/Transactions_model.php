<?php
if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}

require_once 'DB_model.php';

final class Transactions_model extends DB_Model
{
    public function __construct()
    {
        parent::__construct();
    }

    protected $table      = 'transaction';
    protected $alias      = 't';
    protected $identifier = 'idbuy';

    protected function parseOptions(array $options = [])
    {
        return parent::parseOptions($options);
    }
}