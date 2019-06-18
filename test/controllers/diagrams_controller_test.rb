require 'test_helper'

class DiagramsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @diagram = diagrams(:one)
  end

  test "should get index" do
    get diagrams_url
    assert_response :success
  end

  test "should get new" do
    get new_diagram_url
    assert_response :success
  end

  test "should create diagram" do
    assert_difference('Diagram.count') do
      post diagrams_url, params: { diagram: { data: @diagram.data, guid: @diagram.guid } }
    end

    assert_redirected_to diagram_url(Diagram.last)
  end

  test "should show diagram" do
    get diagram_url(@diagram)
    assert_response :success
  end

  test "should get edit" do
    get edit_diagram_url(@diagram)
    assert_response :success
  end

  test "should update diagram" do
    patch diagram_url(@diagram), params: { diagram: { data: @diagram.data, guid: @diagram.guid } }
    assert_redirected_to diagram_url(@diagram)
  end

  test "should destroy diagram" do
    assert_difference('Diagram.count', -1) do
      delete diagram_url(@diagram)
    end

    assert_redirected_to diagrams_url
  end
end
