var larapress = larapress || {};

larapress.removeElementById = function(id)
{
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
};

larapress.getValidationResult = function(captcha_validation_url, token, recaptcha_challenge, recaptcha_response)
{
    var http = new XMLHttpRequest();
    var params = ''
        + '_token=' + encodeURIComponent(token) + '&'
        + 'recaptcha_challenge_field=' + encodeURIComponent(recaptcha_challenge) + '&'
        + 'recaptcha_response_field=' + encodeURIComponent(recaptcha_response);

    http.open('POST', captcha_validation_url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function()
    {
        if ( http.readyState == 4 && http.status == 200 )
        {
            larapress.processResult(http.response);
        }
    };

    http.send(params);
};

larapress.processResult = function(response)
{
    response = JSON.parse(response);

    if ( response.result === 'success' )
    {
        Recaptcha.destroy();

        larapress.removeElementById('captcha-wrapper');
        larapress.removeElementById('captcha-failure');

        document.getElementById('captcha-success').style.display = 'block';
    }
    else
    {
        Recaptcha.reload();
        document.getElementById('captcha-failure').style.display = 'block';
    }
};

larapress.formSubmit = function()
{
    document.getElementById('captcha-failure').style.display = 'none';

    var token = document.getElementsByName('_token')[0].value;
    var recaptcha_challenge = Recaptcha.get_challenge();
    var recaptcha_response = Recaptcha.get_response();
    larapress.getValidationResult(captcha_validation_url, token, recaptcha_challenge, recaptcha_response);

    return false;
};
