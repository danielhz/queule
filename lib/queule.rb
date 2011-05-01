require 'rubygems'
require 'ruil'

# {Queule}
#
# === Usage
#
#    require 'queule'
#    Queule.setup({
#      :uri_prefix => '/queule/',
#      :theme_path => '/custom_theme'
#    })
#
module Queule
  # Setup
  # 
  # @param options [Hash]
  def self.setup(options = {})
    dir = File.dirname(File.expand_path(__FILE__))
    uri_prefix = options[:uri_prefix] || '/queule'
    theme_path = options[:theme_path] || File.join(dir, 'theme')
    script_file = File.join(dir, 'queule.js')
    Ruil::StaticResource.new do |resource|
      resource.add(script_file, uri_prefix + '/script.js', 'application/javascript')
      Dir[File.join(theme_path,'*')].each do |file_name|
        content_type = case file_name
                       when /\.css/
                         'text/css'
                       when /\.png/
                         'image/png'
                       else
                         nil
                       end
        unless content_type.nil?
          file_uri = file_name.sub(/^#{theme_path}/, uri_prefix + '/theme')
          resource.add(file_name, file_uri, content_type)
        end
      end
    end
  end
end
