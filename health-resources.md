# Adding health check resource to APIs 

In our initial effort to monitor the health of all the APIs using Kibana, it is suggested that the health resource should be comprised with the following characteristics:

* HTTP Verb: GET
* Must return with an http status of 200
* The URL needs to be a static resource and does not depend on dynamic data
* Preferred resource name "/health"
* May or may not return data.  Kibana does not interrogate the data to determine.  Preference would be for application/json.  Suggested response could be 
  { 
    "status" : "ok" 
  }
