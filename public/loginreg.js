(function (userManager){
	var selectedPlayer;

	function initEventListeners() {
		$('.js_signup-btn').click(initRegisterModal);
		$('.js_player-login-btn').click(onPlayerLoginButtonClicked);
		$('.js_login-btn').click(onLoginButtonClicked);
		$('.js_player-logout-btn').click(onLogoutButtonClicked);
		$('.js_register-btn').click(onRegisterButtonClicked);
		$('.js_player-count-btn').click(onPlayerCountClicked);

		$('.js_player-editor').click(onPlayerNameEditorClicked);
	}

	function clearTexts() {
		$('#username').val('');
		$('#password').val('');
		$('#repeatpassword').val('');
	}

	function initRegisterModal() {
		$('#loginRegModalHeader').text('Sign up');

		$('.js_login-welcome').hide();
		$('.js_reg-welcome').show();
		$('.js_name-container').show();
		$('.js_password-container').show();
		$('.js_repeatpassword-container').show();
		$('.js_logout-container').hide();
		$('.js_login-btn').hide();
		$('.js_register-btn').show();
		$('.js_loginreg-alert').hide();
		$('.js_loginreg-error').hide();
		$('.js_loginreg-success').hide();
		$('.js_name-container').show();
		$('.js_modalclose-btn').text('Cancel');

		clearTexts();
	}

	function initLoginModal() {
		console.log('Selected player ', selectedPlayer);

		$('#loginRegModalHeader').text('Login');
		$('.js_login-welcome').show();
		$('.js_reg-welcome').hide();
		$('.js_name-container').show();
		$('.js_password-container').show();
		$('.js_repeatpassword-container').hide();
		$('.js_logout-container').hide();
		$('.js_login-btn').show();
		$('.js_register-btn').hide();
		$('.js_loginreg-alert').hide();
		$('.js_loginreg-error').hide();
		$('.js_loginreg-success').hide();
		$('.js_name-container').show();
		$('.js_modalclose-btn').text('Cancel');

		$('#loginRegModal').on('shown.bs.modal', function () {
			if ($('.js_player' + selectedPlayer + '-name').val().trim() !== '') {
				$('#username').val($('.js_player' + selectedPlayer + '-name').val());
				$('#password').focus();
			} else {
				$('#username').focus();
			}
		});

		clearTexts();
	}

	function onPlayerLoginButtonClicked(event) {
		selectedPlayer = $(event.currentTarget).attr('data-playerid');
		initLoginModal();
		$('#loginRegModal').modal();
	}

	function onLogoutButtonClicked(event) {
		selectedPlayer = $(event.currentTarget).attr('data-playerid');
		userManager.logout(selectedPlayer);

		$('.js_player' + selectedPlayer + '-login').show();
		$('.js_player' + selectedPlayer + '-logout').hide();
		$('.js_player' + selectedPlayer + '-name').removeClass('disabled').val('').removeAttr('disabled');
	}

	function onLoginButtonClicked() {
		var username = $('#username').val(),
			password = $('#password').val(),
			query;

		if (username.trim() === '') {
			$('.js_loginreg-alert').show().text('Please enter a name');
			$('#username').focus();
			return;
		}
		if (password.trim() === '') {
			$('.js_loginreg-alert').show().text('Please enter a password');
			$('#password').focus();
			return;
		}
		if (userManager.isLoggedIn(username)) {
			$('.js_loginreg-alert').show().text('This player is already logged in!');
			$('#username').focus();
			return;
		}

		dpd.users.get({username: username}, function (loginUsers, loginError) {
			if (loginUsers.length === 1) {
				var loginUser = loginUsers[0];
				dpd.users.put({id: loginUser.id, verify: password}, loginUser, function (result, err) {
					console.log('Result', result);
					if (err) {
						console.log('Res ', err);
						$('.js_loginreg-error').show().text('Invalid name or password');
					} else {
						setPlayerLoggedIn(loginUser, result.sessionId);
					}
				});
			} else {
				$('.js_loginreg-error').show().text('Invalid name or password');
			}
		});
	}

	function setPlayerLoggedIn(loginUser, sessionid) {
		userManager.login(selectedPlayer, loginUser, sessionid);
		$('#loginRegModal').modal('hide');
		$('.js_player' + selectedPlayer + '-login').hide();
		$('.js_player' + selectedPlayer + '-logout').show();
		$('.js_player' + selectedPlayer + '-name').addClass('disabled').val(loginUser.username).attr('disabled', 'true');
	}

	function onRegisterButtonClicked() {
		var username = $('#username').val(),
			password = $('#password').val(),
			repeatpassword = $('#repeatpassword').val();

		if (username.trim() === '') {
			$('.js_loginreg-alert').show().text('Please enter a name');
			$('#username').focus();
			return;
		}
		if (password.trim() === '') {
			$('.js_loginreg-alert').show().text('Please enter a password');
			$('#password').focus();
			return;
		}
		if (password.trim() !== repeatpassword.trim()) {
			$('.js_loginreg-alert').show().text('The two passwords are not matching');
			$('#password').focus();
			return;
		}
		$('.js_loginreg-alert').hide();
		$('.js_loginreg-error').hide();
		$('.js_register-btn').hide();
		dpd.users.post({'username': username, 'password': password}, function(result, err) {
			if (err) {
				if (err.errors && err.errors.regerror === 'Username is taken') {
					$('.js_loginreg-error').show().text('This name is already taken, please choose another one');
				} else {
					$('.js_loginreg-error').show().text('Error during registraton :(');
				}
				$('.js_register-btn').show();
				console.log(err);
			} else {
				$('.js_loginreg-success').show().text('Great success! Registration completed!');
				$('.js_modalclose-btn').text('Close');
				$('.js_name-container').hide();
				$('.js_password-container').hide();
				$('.js_repeatpassword-container').hide();
				setTimeout(function () {
					$('#loginRegModal').modal('hide');
				}, 2000);
				console.log(result, result.id);
			}
		});
	}

	function onPlayerNameEditorClicked() {
		if (userManager.playerCount() === 0) {
			$('.js_player-login').show(200);
		}
	}

	function onPlayerCountClicked(event) {
		$('.js_player-count-btn').removeClass('active');
		$(event.currentTarget).addClass('active');
		var count = Number($(event.currentTarget).attr('data-id'));
		//$('.js_player-name-container').hide();
		var animation = ($('.js_player-login:visible').length > 0) ? 200 : undefined;

		if (count <= 3) {
			$('.js_player4-name-container').hide(animation);
		}
		if (count <= 2) {
			$('.js_player3-name-container').hide(animation);
		}
		if (count === 1) {
			$('.js_player2-name-container').hide(animation);
		}

		if (count >= 2 && $('.js_player2-name-container:visible').length === 0) {
			$('.js_player2-name-container').show(animation);
		}
		if (count >= 3 && $('.js_player3-name-container:visible').length === 0) {
			$('.js_player3-name-container').show(animation);
		}
		if (count >= 4 && $('.js_player4-name-container:visible').length === 0) {
			$('.js_player4-name-container').show(animation);
		}

	}

	function secure(p) {
		return sha1(p + 'x*kv345oooksdkopasdl2e;asdlasdc01]v}}coaiu2ksxllxaasx');
	}

	function sha1(c){var l=function(a,b){return a<<b|a>>>32-b},n=function(a){var b="",c,d;for(c=7;0<=c;c--)d=a>>>4*c&15,b+=d.toString(16);return b},a,d,g=Array(80),p=1732584193,q=4023233417,r=2562383102,s=271733878,t=3285377520,b,e,f,h,k;c=unescape(encodeURIComponent(c));b=c.length;var m=[];for(a=0;a<b-3;a+=4)d=c.charCodeAt(a)<<24|c.charCodeAt(a+1)<<16|c.charCodeAt(a+2)<<8|c.charCodeAt(a+3),m.push(d);switch(b%4){case 0:a=2147483648;break;case 1:a=c.charCodeAt(b-1)<<24|8388608;break;case 2:a=c.charCodeAt(b-
		2)<<24|c.charCodeAt(b-1)<<16|32768;break;case 3:a=c.charCodeAt(b-3)<<24|c.charCodeAt(b-2)<<16|c.charCodeAt(b-1)<<8|128}for(m.push(a);14!=m.length%16;)m.push(0);m.push(b>>>29);m.push(b<<3&4294967295);for(c=0;c<m.length;c+=16){for(a=0;16>a;a++)g[a]=m[c+a];for(a=16;79>=a;a++)g[a]=l(g[a-3]^g[a-8]^g[a-14]^g[a-16],1);d=p;b=q;e=r;f=s;h=t;for(a=0;19>=a;a++)k=l(d,5)+(b&e|~b&f)+h+g[a]+1518500249&4294967295,h=f,f=e,e=l(b,30),b=d,d=k;for(a=20;39>=a;a++)k=l(d,5)+(b^e^f)+h+g[a]+1859775393&4294967295,h=f,f=e,e=
		l(b,30),b=d,d=k;for(a=40;59>=a;a++)k=l(d,5)+(b&e|b&f|e&f)+h+g[a]+2400959708&4294967295,h=f,f=e,e=l(b,30),b=d,d=k;for(a=60;79>=a;a++)k=l(d,5)+(b^e^f)+h+g[a]+3395469782&4294967295,h=f,f=e,e=l(b,30),b=d,d=k;p=p+d&4294967295;q=q+b&4294967295;r=r+e&4294967295;s=s+f&4294967295;t=t+h&4294967295}k=n(p)+n(q)+n(r)+n(s)+n(t);return k.toLowerCase()};

	initEventListeners();

})(userManager);
