class TestController < ApplicationController
  def index
    redirect_to some_bad_path
  end
end