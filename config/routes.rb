Rails.application.routes.draw do
  resources :diagrams

  get 'front_end/index'
  root controller: :front_end, action: :index
end
