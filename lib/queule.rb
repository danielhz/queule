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
    uri_prefix = options[:uri_prefix] || '/queule/'
    theme_path = options[:theme_path] || 'queule/theme'
    # Register script
    dir = File.dirname(File.expand_path(__FILE__))
    script_file = File.join(dir, 'queule.js')
    Ruil::StaticResource.new do |resource|
      resource.add(script_file, uri_prefix + 'script.js', 'application/javascript')
    end
  end
end
