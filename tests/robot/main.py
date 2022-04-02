import time
from selenium import webdriver
import sys

def scroll_into_view (driver, element):
    element_position = element.location['y'] + 200
    js = "window.scroll(0, {position})".format(position = element_position)
    driver.execute_script(js)

# Expect path to driver to come from the command line
path_to_driver = sys.argv[1]
# Parameter, for local and prod testing
path_to_site = sys.argv[2]

# Taken from https://chromedriver.chromium.org/getting-started#:~:text=Python%3A-,import%20time,driver.quit(),-Controlling%20ChromeDriver%27s%20lifetime
driver = webdriver.Chrome(path_to_driver)  # Optional argument, if not specified will search path.

driver.get(path_to_site)

# Expect the site to load in that time
time.sleep(4)

# Get the button to create the contract
create_button = driver.find_element_by_xpath('//*[@id="headlessui-tabs-panel-5"]/div/div[1]/div/button')

driver.execute_script("arguments[0].click();", create_button)