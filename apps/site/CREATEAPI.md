## Create API and bind to data source

1. In api tab add new definition
2. select open api spec 2.0
3. give any name
4. paste the following code in editor and save 4:27
5. create new api data source
6. select open api definition created in previous step
7. in json schema select `posts`
8. enable get api
9. select host `gist.githubusercontent.com`
10. in json path enter: $[*]
11. save.
12. drag accordion conponent and select the api data source in data props.
13. if you check network tab, you can see the http request being made.
14. but console will have following error and there will be no data in
    accordion.
