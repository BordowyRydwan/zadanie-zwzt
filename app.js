import { route } from './router';

route('/ex1', 'example1', function() {
  this.title = 'Example 1';
});

route('/ex2', 'example2', function() {
  this.title = 'Example 2';
  this.counter = 0;
  this.$on('.my-button', 'click', () => {
    this.counter += 1;
    this.$refresh();
  });
});

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

      this.errorMsg = responseJSON.message;
      this.$refresh();
    }
  });

});

route('*', '404', function () {});
