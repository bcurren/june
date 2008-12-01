first_namespace :screw do
  task :run do
    dir = File.dirname(__FILE__)
    implementation_path = "#{dir}/lib"
    spec_path = "#{dir}/spec"
    
    system("#{dir}/vendor/screw_unit_server/bin/screw_unit_server #{spec_path} #{implementation_path} #{implementation_path}")
  end
end
  