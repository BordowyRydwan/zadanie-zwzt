import { route } from './purejs/router';

route('/success', 'success', function() {
  this.title = 'Successful login!';
  this.logout = 'Log out';

  this.$on('.logout-btn', 'click', () => {
    window.location = '#';
  });
});

route('/', 'home', function () {
  this.data = {
    title: "Login form",
    errorMsg: null,
    lastUsername: '',
  };

  this.methods = {
    getResponseFromLoginAPI: (loginApiURL, data) => {
      return fetch(loginApiURL, {method: 'POST', body: JSON.stringify(data)});
    },

    getFormData: () => {
      const formData = new FormData(document.querySelector('.login-form'));

      return Object.fromEntries(formData.entries());
    },

    validateFormData: formData => {
      const {username, password} = formData;

      // double security is still better than none :)
      if(!(username && password)){
        throw new Error('Validate form has been modified');
      }

      if(username.length === 0 && password.length === 0){
        this.data.errorMsg = 'Enter password and login!';
        return false;
      }
  
      if(username.length === 0){
        this.data.errorMsg = 'Enter your login!';
        return false;
      }
  
      if(password.length === 0){
        this.data.errorMsg = 'Enter your password!';
        return false;
      }

      return true;
    }
  };

  this.$on('.login-form', 'submit', async (evt) => {
    const requestData = this.methods.getFormData();
    const dataValidationCheck = this.methods.validateFormData(requestData);

    const loginApiURL = 'https://zwzt-zadanie.netlify.app/api/login';

    evt.preventDefault();

    if(dataValidationCheck){
      const response = await this.methods.getResponseFromLoginAPI(loginApiURL, requestData);

      if(response.status >= 200 && response.status <= 299){
        window.location = '#/success';
      }
      else{
        const responseJSON = await response.json();

        this.data.lastUsername = requestData.username;
        this.data.errorMsg = responseJSON.message;
      }
    }

    this.$refresh();
  });

});

route('*', '404', function () {});
