require 'test_helper'

class FrontEndControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get front_end_index_url
    assert_response :success
  end

end
