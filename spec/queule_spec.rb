require 'rubygems'
require 'queule'
require 'rspec'

describe Queule do

  it 'should get the script file' do
    Queule.setup
    request = {
      'REQUEST_METHOD' => 'GET',
      'PATH_INFO'      => '/queule/script.js'
    }
    response = Ruil::Register.call(request)
    response.status.should == 200
    response.content_type.should == 'application/javascript'
  end

end
