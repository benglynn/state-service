# State service

HTTP triggered cloud functions to get/set datastore data.

## Create a bucket to store the functions (just once)
```bash
gsutil mb gs://jepd-state-service
```

## Deploy
```bash
gcloud beta functions deploy actions --stage-bucket jepd-state-service --trigger-http
```

Look for the `httpsTrigger` URL in the console after deployment. For example:
https://us-central1-state-service.cloudfunctions.net/getState

## Remove
```bash
 gcloud beta functions delete functionName
 ```