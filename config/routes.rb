Rails.application.routes.draw do
  get 'front_end/index'
  root controller: :front_end, action: :index
end
