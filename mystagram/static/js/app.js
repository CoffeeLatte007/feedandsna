$(function() {
  var domain = 'http://123.206.46.62:8080/'
  var id_arr = []

  $(".page-main").on('click', '.follow', function() {
    var that = this
    $(that).css('display', 'none')
      .siblings(".loading").css('display', 'inline-block')
    $.ajax({
      url: domain + '/follow?userid=' + $(that).data('uid') + '&currentuserid=' + window.cuid,
      type: 'GET',
      dataType: 'jsonp',
      jsonp: 'callback',
      success: function() {
        $(that).siblings(".loading").css('display', 'none')
          .siblings(".isfollower").css('display', 'inline-block')
        getNum();
      }
    })
  })

  //确认当前用户是否已关注该主页所属者
  isfollowing($(".profile-content"), [window.uid])
  //初次进入获取用户关注和被关注人数
  getNum();


  $(".followers, .following").on('click', function(e) {
    location.hash = this.className
    url = domain + window.uid + "/" + this.className
    loadUser(url)
  })

  //利用hash值保留ajax后退
  window.onpopstate = function() {
    var url = domain + window.uid + "/"
    var hash = location.hash
    if (!hash) {
      location.reload()
      return
    }
    switch (hash) {
      case '#followers':
        break
      case '#following':
        break
      default:
        return false
    }
    loadUser(url + hash.substr(1))
  }

  //监听ajax异常
  $(document).ajaxError(function() {
    alert("网络异常，请刷新")
  })

  //获取关注和被关注的人数
  function getNum() {
    $.ajax({
        url: domain + "numsFollow/" + window.uid,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function(res) {
          console.log(res)
          $(".followers_count").text(res.data.numFollowers)
          $(".following_count").text(res.data.numFollowing)
        }
    })
  }

  //加载关注和被关注人员列表
  function loadUser(url) {
    if (!url) return false
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function(res) {
          id_arr = []
          var htmltpl = ''
          console.log(res.data.users)
          if (res.data.users) {
            res.data.users.forEach(function(user) {
              id_arr.push(user.id)
              htmltpl += tpl(user)
            })
          }
          else {
            htmltpl = '<h2>暂无此类信息</h2>'
          }

          $(".list-mod").html(htmltpl)
          isfollowing($(".list-mod"), id_arr)
        }
    })
  }

  //根据给定的id数组查看用户是否已关注
  function isfollowing(e, ids) {
    $.ajax({
      type: 'GET',
      url: domain + window.cuid + '/isfollowing?useruuid=' + ids.join(','),
      dataType: 'jsonp',
      jsonp: 'callback',
      success: function(res) {
        e.find(".follow-info").each(function(ind, elem) {
          if (res.data[ind]) {
            $(elem).find('.isfollower').css('display', 'inline-block')
          }
          else {
            $(elem).find('.follow').css('display', 'inline-block')
          }
          $(elem).find(".loading").css("display", "none")
        })
      }
    })
  }

  //单个人员html片段
  function tpl (data) {
    var str = '<span class="follow-item">'
               + '<a target="_blank" href="/profile/' + data.id + '" class="follow-avatar">'
               + '<img src="' + data.headUrl + '">'
               + '</a><span class="follow-opt">'
               + '<span class="follow-name">' + data.username + '</span>'
    
    if (data.id != window.cuid) {
      str += '<span class="follow-info"><img class="loading" src="/static/images/img/loading.gif"><button data-uid=' + data.id + ' class="follow">+ 关注他</button><button class="isfollower">已关注</button></span>'
    }

    str += '</span></span>'
    return str
  }
})