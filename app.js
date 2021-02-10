import { route } from './purejs/router';

route('/success', 'success', function() {
  this.title = 'Successful login!';
  this.logout = 'Log out';

  this.$on('.logout-btn', 'click', () => {
    window.location = '#';
  });
});

route('/', 'home', function () {
  this.title = "Login form";
  this.errorMsg = null;
  this.responseToken = null;

  this.lastUsername = '';
  this.lastPassword = '';

  this.data = {

  };

  this.methods = {

  };

  this.$on('.login-form', 'submit', async (evt) => {
    const formData = new FormData(document.querySelector('.login-form'));
    const formDataObject = Object.fromEntries(formData.entries());
    const loginApiURL = 'https://zwzt-zadanie.netlify.app/api/login';

    evt.preventDefault();

    // double security is still better than none :)
    if(formDataObject.username.length === 0 && formDataObject.password.length === 0){
      this.errorMsg = 'Enter password and login!';
      this.$refresh();
      return;
    }

    if(formDataObject.username.length === 0){
      this.errorMsg = 'Enter your login!';
      this.$refresh();
      return;
    }

    if(formDataObject.password.length === 0){
      this.errorMsg = 'Enter your password!';
      this.$refresh();
      return;
    }

    const response = await fetch(loginApiURL, {method: 'POST', body: JSON.stringify(formDataObject)});

    if(response.status >= 200 && response.status <= 299){
      window.location = '#/success';
    }
    else{
      const responseJSON = await response.json();

      this.lastUsername = formDataObject.username;
      this.lastPassword = formDataObject.password;
      this.errorMsg = responseJSON.message;
      this.$refresh();
    }
  });

});

route('*', '404', function () {});
