---
layout: post
title: "puppeteer the Node.js process with a non-zero exit code"
author: "hoyeonUm"
---

Lazy loading 싸이트를 긁어오기위해 요즘 핫하다는 puppeteer 를 사용해보고자 설치했다.
내 개발환경은 현재 윈도우와 리눅스 혹은 vagrant 등 여러환경을 가지고있지만, 프로젝트가 윈도우에 설치되어있어서 윈도우로 개발시작

윈도우에 잘 설치한 이후 테스트를 끝낸이후 QA 서버 (centos) 환경에 배포완료.

#### 실행명령어
{% highlight shell bash %}
./node_modules/puppeteer/.local-chromium/linux-508693/chrome-linux/chrome -v --headless --no-sandbox --disable-setuid-sandbox
{% endhighlight %}

#### 오류발생
{% highlight shell bash %}
puppeteer the Node.js process with a non-zero exit code.
{% endhighlight %}

#### 해결 
##### centos
{% highlight shell bash %}
yum install -y nss

yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y

yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrand
r.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y
{% endhighlight %}

##### Debian
{% highlight shell bash %}
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
{% endhighlight %}
