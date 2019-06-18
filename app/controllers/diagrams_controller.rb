class DiagramsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def show
    @diagram = Diagram.find_by(guid: params[:id])
  end

  def create
    @diagram = Diagram.new(diagram_params)

    respond_to do |format|
      if @diagram.save
        format.json { render :show, status: :created, location: @diagram }
      else
        format.json { render json: @diagram.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @diagram = Diagram.find(params[:id])

    respond_to do |format|
      if @diagram.update(diagram_params)
        format.json { render :show, status: :ok, location: @diagram }
      else
        format.json { render json: @diagram.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def diagram_params
    params.require(:diagram).permit(:guid, :data)
  end
end
