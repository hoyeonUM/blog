---
layout: post
title: "Inoodb buffer pool 이란 ?"
author: "hoyeonUm"
---
{% highlight markdown %}
'mysql' innodb buffer pool 설정에 관해서 알아보자.


현재 내가 맡고 있는 업무는 사내프로젝트 유지보수를 하고있다.
문제가있는 테이블은 현재 정규화가 되어있지 않으며, 컬럼수는 약 100개 정도,  약 천만건정도의 데이터가 쌓여있으며 총 데이터 크기 60G , 인덱스길이 2G 정도 된다.  DB 서버는 웹서버와 분리되어있지 않으며 현재 서버메모리는 8G .


모든 쿼리는 인덱스를 타지만, slow query 가 많이올라오고 loadaverage 는매일 업무가 시작되는 9시  10 이상 튄다.
소스가 오래되었기에, 테이블을 정규화해서 고치기에는 리스크가 너무컸다. 어떻게 하면 리스크없이 부하를 잡을수있을까 고민하던 찰나에 얼마전 읽은 `대규모 서비스를 지탱하는 기술` 책에서 캐시(os 캐시)를 이용하라고 얼핏 본거같았다. 그래서 mysql query_cache_size 에 대해서 찾아보기 시작했다.
{% endhighlight %}

### 첫번째시도
{% highlight markdown %}
아래 참조에서 보면 READ-ONLY 와 READ-WRITE 에서의 cache on 일때의 차이가 크다. 이유는 Query cache 와 전혀 관련 없는 데이터라고 하더라도 관련 테이블 변경시점에 캐시가 사라진다. 내가 지금 유지보수 하고있는 사이트는 실시간으로 100개의 컬럼들이 수시로 변경된다(OLTP). 따라서 `mysql cache` 설정은 변경하지 않기로 결정했다.
{% endhighlight %}
[MySQL에서의 Query Cache. 잘써도 독일 수 있다!!](http://blog.naver.com/PostView.nhn?blogId=bomyzzang&logNo=220797362103&parentCategoryNo=&categoryNo=10&viewDate=&isShowPopularPosts=true&from=search)


### 두번째시도.
{% highlight plaintext %}
OS 캐시를 이용해보자. `*.idb` 파일을주기적으로  cat 을 함으로써 os 캐시에 올린다. 하지만 OS 캐시가DB 자원에 전부 할당되지않고 다른데몬에 의해 순위가 밀려버리면 disk IO가 증가하게되버린다. 그리고 지금은 서버는 8G 밖에 없고, 데이터크기는 60G 이기 때문에 disk IO 가 생길수 밖에 없는상황이므로 OS 캐시를 활용함에 있어서 부적절하다고 생각되서 다른방안을 모색해보았다
{% endhighlight %}

### 세번째시도
{% highlight markdown %}
my.cnf 파일을 보는도중 Innodb buffer pool 설정을 발견하게 되었다. 현재 설정되어있는 값은 256M 설정이 잡혀있었다.
설명은 다음과 같다.
`InnoDB 는 데이터와 인덱스를 메모리에 캐싱하기 위한 버퍼 풀이라는 저장 영역을 유지 관리한다. InnoDB 버퍼 풀의 작동방식을 알고, 자주 액세스하는 데이터를 메모리에 저장하는 이점을 취하는 것은 MySQL 튜닝의 중요한 측면입니다. InnoDB 버퍼풀의 페이지 교체알고리즘은 LRU 알고리즘(Least Recently Used -> 과거에 가장오랫동안 사용하지 않은 것을 교체) 을 채택
했다.`
buffer pool 에는 데이터와, 인덱스를 저장한다.
메모리를 과도하게 잡게되면 swap 이잡히므로 주의해서 설정해야한다.

나는 서버메모리 증설을 요청하였고, 8G 증가되었으며 총 16G 에 buffer pool 설정은 50% (8G) 설정을 하였다.
어쨋든 결론이다.  메모리 추가와, 설정변경이 있는밤에는 당장 표시가 나지않았다. 아마 메모리 최적화가 이루어지고있는걸로 예상된다.
다음날  sar 를 통해 load average 를 확인한결과 1 미만으로 표시되었다.
결론은 버퍼 용량을 늘린다음으로는 load average가 1 미만으로 나타났다.

위 설정을 변경하면서경합성을 줄위기위해 innodb_buffer_pool_instances 설정을  관련해서 인스턴스를 늘려야 하는것인지,  1G 당 1개씩 늘리는것이 좋다라든지에 대한 논쟁이 있었는데 
버전이 낮아서 적용되지 못하였다. 5.5.4 이상부터 지원되기 때문.

메모리 설정을 할때는 다음을 참고하자
`
Min_thread_memory =
  thread_stack_size
  + (net_buffer_length * 2)

Max_thread_memory =
  thread_stack_size
  + (max_allowed_packet*2)
  + read_buffer_size
  + join_buffer_size
  + sort_buffer_size
  + tmp_table_size
  + myisam_sort_buffer_size

Max_server_memory =
  query_cache_size
  + innodb_buffer_pool_size
  + innodb_additional_mem_pool_size
  + innodb_log_buffer_size
  + key_buffer_size

Max_memory =
  (Min_thread_memory ~ Max_thread_memory) * max_connections
  + Max_server_memory;
`
{% endhighlight %}

[메모리 계산](http://intomysql.blogspot.com/2010/12/mysql_9509.html)
[메모리 계산 2](http://code-factory.tistory.com/m/41)

[버퍼풀 인스턴스 이슈](https://blog.jcole.us/2010/09/28/mysql-swap-insanity-and-the-numa-architecture/)

[mysql5.5 innodb-buffer-pool](https://dev.mysql.com/doc/refman/5.5/en/innodb-buffer-pool.html)

