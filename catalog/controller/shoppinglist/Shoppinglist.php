<?php

class ControllerShoppinglistShoppinglist extends Controller {

    public function index() {
        $this->load->model('catalog/product');
        $json = [];
        $this->response->addHeader('Content-Type: application/json');
        if (!isset($this->request->get['filter_name'])) {
            $json['success'] = true;
            $this->response->setOutput(json_encode($json));
        }
        $filter_name = $this->request->get['filter_name'];
        $limit = 10;
        $filter_data = [
            'filter_name' => $filter_name,
//            'filter_model' => $filter_model,
            'start' => 0,
            'limit' => $limit
        ];
        $products = $this->model_catalog_product->getProducts($filter_data);
//        $each_product_keys = ['p.name', 'p.model', 'p.price', 'p.quantity', 'p.status','p.sort_order' ];
        $json['products'] = [];
        foreach ($products as $product) {
            $json['products'][] = [
                'product_id' => $product['product_id'],
                'name' => $product['name'],
                'price' => $product['price'],
                'quantity' => $product['quantity'],
                'model' => $product['model'],
                'status' => $product['status'],
                'image' => $product['image']
            ];
        }
        $json['success'] = true;
        $this->response->setOutput(json_encode($json));
    }

}
