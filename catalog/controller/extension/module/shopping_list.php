<?php

class ControllerExtensionModuleShoppingList extends Controller {

    public function index() {
        $this->load->language('extension/module/shopping_list');

        $data['heading_title'] = $this->language->get('heading_title');

        $data['text_input'] = $this->language->get('text_input');
        $data['text_placeholder'] = $this->language->get('text_placeholder');
        $data['text_items'] = $this->language->get('text_items');
        $data['text_total'] = $this->language->get('text_total');
        $data['text_quantity'] = $this->language->get('text_quantity');
        
        $data['button_add_to_wishlist'] = $this->language->get('button_add_to_wishlist');
        $data['button_add_to_cart'] = $this->language->get('button_add_to_cart');
        $data['button_clear'] = $this->language->get('button_clear');

        $this->document->addScript('catalog/view/javascript/shopping-list/angular.min.js');
        $this->document->addScript('catalog/view/javascript/shopping-list/angular-cookies.min.js');
        $this->document->addScript('catalog/view/javascript/shopping-list/shopping-list.js');
        $this->document->addStyle('catalog/view/javascript/shopping-list/stylesheet.css');
        return $this->load->view('extension/module/shopping_list', $data);
    }
}
