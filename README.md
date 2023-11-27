# Database Connection Speed Test

This repo and study aims to compare and analyse the speed and performance of *Node.js*, *Python*, and *PHP* when connecting to a database. Its primary aim is to aid in deciding which programming language to use when working with a relational database. In this study, MariaDB was used as the database management system. 

Selection
-----------------------

**Node.js** and *JavaScript* is the language of choice for many developers as it can be used for both frontend and backend sides of the application. This is seen to simplify the development process significantly.

**PHP** has been a popular choice for backend web development for many years. Like Python, it is also considered easy to learn.

**Python** is a popular language with a large and supportive community of users. It is a popular choice for manipulating databases since it is used in mathematical and scientific analysis.

**MariaDB** is a fork of *MySQL* - a very popular database management system. This report will therefore test connecting to a MySQL-like database as well as testing the support for a less popular system.

Method
-----------------------
**Docker** will be used to containerise the database and each of the environments for *Node.js*, *PHP*, and *Python*. A large example database collected from MySQLTutorial was used for this study [[1]]. A "healthcheck" in the *docker-compose.yml* file was used in order to ensure that the database's condition was "healthy" before the *node*, *python*, or *php* services were executed. 

The documentation for MariaDB [[2]] and Node.js was invaluable in setting up the connection between them. The Dockerfile is also easy to set-up and uses a very straightforward template image for Node.js [[3]]. At 1.27GB, the image on Docker is the largest of the three.

PHP is also straightforward to set up. An official image and template from Docker Hub can be used [[4]] and only *mysqli* ,which is required for connecting to the database, was needed [[5]]. The image was the most lightweight by far at 529.41 MB.

Python was less straightforward. It required quite a few dependencies and its Dockerfile needed a lot of adjustment in order to work despite its documentation [[6]]. The image size was 914.1 MB.

To ensure that each environment is tested fairly, it is recommended that the database, and each language, is tested separately. This means that each time a language is tested, the docker containers should be rebuilt and `docker compose up` should be used followed by `database` and the service for the language being tested:

```
$ docker-compose up database <service/language tested>
```
For example:

```
$ docker-compose up database node
```

In each "test", a series of queries will be executed to test the connection to the database. First, it measures the time it takes (in seconds) to connect to the database, then it will perform `INSERT`, `SELECT`, `ALTER`, and `DELETE` queries and measure how long these take to execute. This will be repeated `1000` times and each test, along with a summary of the average results will be exported to a text file in the respective "language's" folder.

Results
-----------------------
### Node.js

| **Statement**     | **Average Time (s)**      |
|-------------------|-----------------------|
| _INSERT data_     | 0.0010187383379998646 |
| _SELECT data_     | 0.0004690494549998984 |
| _ALTER data_      | 0.0011608703870001626 |
| _DELETE data_     | 0.0009649409519999608 |
| _Connection Time_ | 4.538911422000004     |

### PHP

| **Statement**     | **Average Time (s)**    |
|-------------------|---------------------|
| _INSERT data_     | 0.00091771459579468 |
| _SELECT data_     | 0.00018581390380859 |
| _ALTER data_      | 0.00099727463722229 |
| _DELETE data_     | 0.00083715391159058 |
| _Connection Time_ | 0.003331184387207   |

### Python

| **Statement**     | **Average Time (s)**  |
|-------------------|-----------------------|
| _INSERT data_     | 0.0010126121044158937 |
| _SELECT data_     | 0.0002478468418121338 |
| _ALTER data_      | 0.0010988070964813232 |
| _DELETE data_     | 0.0008242974281311035 |
| _Connection Time_ | 0.005898475646972656  |

In summary, in milliseconds:

| **Statement**     | **Node.js** | **PHP**     | **Python**  |
|-------------------|-------------|-------------|-------------|
| _INSERT data_     | 1.018738338 | 0.917714596 | 1.012612104 |
| _SELECT data_     | 0.469049455 | 0.185813904 | 0.247846842 |
| _ALTER data_      | 1.160870387 | 0.997274637 | 1.098807096 |
| _DELETE data_     | 0.964940952 | 0.837153912 | 0.824297428 |
| _Connection Time_ | 4538.911422 | 3.331184387 | 5.898475647 |

If we take PHP as a baseline, we can compare the percentage differences between each:

| **Statement**     | **Node.js** | **PHP** | **Python** |
|-------------------|-------------|---------|------------|
| _INSERT data_     | 111.01%     | 100.00% | 110.34%    |
| _SELECT data_     | 252.43%     | 100.00% | 133.38%    |
| _ALTER data_      | 116.40%     | 100.00% | 110.18%    |
| _DELETE data_     | 115.26%     | 100.00% | 98.46%     |
| _Connection Time_ | 136255.18%  | 100.00% | 177.07%    |

Analysis
-----------------------
From the results of the above tests, it is apparent that *PHP* is fastest at connecting and querying data from *MariaDB*. In addition, it was one of the easiest to set-up and the most lightweight images of the three.

Due to its asynchronous nature, *Node.js* was not as efficient as the other two, especially when connecting to the database. It was also the largest image of the three.

PHP was narrowly beaten by *Python* - by 1.04 points - when using a `DELETE` query. There was not much differentiation between the other queries, except for connecting to the database.

Conclusion
-----------------------
*PHP*, from the results above, appears to the outright 'winner' of this study. In almost all tests it beats both *Node.js* and *Python*. Although there appears to be not much differentiation between PHP and Python, this could in the end result in longer delays if many queries are made. 

When choosing a language to work with databases, it also important to consider the ease of development. From my experience in this study, *PHP* was by the easiest to set-up especially compared to Python. It was also the most lightweight.

Since most developers will not be choosing a language solely on querying databases alone, it also important to consider *Node.js*'' ability to handle concurrent connections and its asynchronicity. PHP is not well suited to real-time applications.

If I were to repeat this study I would ensure to test the database under pressure - creating multiple containers that query using each of the languages under test. Due to the languages' different use cases and advantages, this could lead to different conclusions and recommendations. 

In summary, although *PHP* is fastest out of the results of these tests, developers may still wish to consider *Node.js* due to its benefits for some larger or complex web applications.

References
-----------------------

[[1]] MySQLTutorial (n.d) *MySQL Sample Database* [Online]. Available: https://www.mysqltutorial.org/mysql-sample-database.aspx

[[2]] MariaDB (n.d). *Getting Started With the Node.js Connector*  [Online] Available: https://mariadb.com/kb/en/getting-started-with-the-nodejs-connector/

[[3]] Docker (n.d.) *Containerize a Node.js application* [Online]. Available: https://docs.docker.com/language/nodejs/containerize/

[[4]] Docker Hub (n.d) *PHP Docker Official Image* [Online]. Available: https://docs.docker.com/language/nodejs/containerize/

[[5]] Hedgpeth, Rob (2022, 02 February) *Developer Quickstart: PHP mysqli and MariaDB* [Online]. Available: https://mariadb.com/resources/blog/developer-quickstart-php-mysqli-and-mariadb/

[[6]] Hedgpeth, Rob (2020, 25 June) *How to connect Python programs to MariaDB* [Online]. Available: https://mariadb.com/resources/blog/how-to-connect-python-programs-to-mariadb/


[1]: https://www.mysqltutorial.org/mysql-sample-database.aspx

[2]: https://mariadb.com/kb/en/getting-started-with-the-nodejs-connector/

[3]: https://docs.docker.com/language/nodejs/containerize/

[4]: https://hub.docker.com/_/php

[5]: https://mariadb.com/resources/blog/developer-quickstart-php-mysqli-and-mariadb/

[6]: https://mariadb.com/resources/blog/how-to-connect-python-programs-to-mariadb/

Other
-----------------------

**Author:** Zachary Mooney