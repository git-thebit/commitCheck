@RestResource(urlMapping='/v1/welcome/*')
Global class WelcomeClass {
	global static Final String WELCOME_MESSAGE = 'This is message from rest resource class';
    
    @httpGet
    global static String greetingMessage() {
        return WELCOME_MESSAGE;
    }
    
    @httpPost
    global static String postGreetingMsg() {
        return 'Post method called';
    }
    
    @httpPatch 
    global static String patchGreetingMsg() {
        return 'Patch method called';
    }
}