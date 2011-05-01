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

  it 'should get the theme files' do
    Dir['lib/theme/*'].each do |file_name|
      request = {
        'REQUEST_METHOD' => 'GET',
        'PATH_INFO'      => file_name.sub(/lib/, '/queule')
      }
      response = Ruil::Register.call(request)
      response.status.should == 200
      case file_name
      when /\.css/
        response.content_type.should == 'text/css'
      when /\.png/
        response.content_type.should == 'image/png'
      end
    end
  end

end
