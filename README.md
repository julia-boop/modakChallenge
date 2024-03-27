# Modak Challenge - Rate Limiting Service
### By Julia Cordero :hugs:

> [!IMPORTANT]
> The code is developed in Node.js, in order to execute de file, Node.js should be installed and the command `node Modak.js` should be run in the terminal situated in the same directory as the file Modak.js

The following code attempts to recreate an emailing service, which is being handled by a rate limiting system to ensure that clients are not recieving an excessive amount of emails. In order to do this, I have created a `SendMessage` method within the `NotificationService` class which simulates this case. In the following lines I will proceed to explain how does each method works. 

## :atom: Notification Service Class 
`SendMessage` : This method firstly handles the possible case where an unidentified rule is passed. Then, it proceeds to define 3 important variables, the present time, the last time an email was sent and the amount of messages that have been already sent to the user. With these variables, I was able to calculate if the difference in time between the last sent message and the present is smaller than the interval set for that message type. If this is true, and if the amount of messages sent have not reached the limit, then a new message can be sent. If not, an error is thrown. When a new message is sent, the count property is updated. 

`GetRateLimitRule` : This method is a setter, it contains less logic, but it states the rules that should be applied for the type of messages that are wished to be sent. Calculating time in miliseconds, these are the rules:

:triangular_flag_on_post: News: 2 Per minute

:triangular_flag_on_post: Status: 1 Per day

:triangular_flag_on_post: Marketing: 3 Per hour

## :atom: Gateway Class 
This class initializes the process to send a message to the user. 

## :dependabot: Testing 
Once the service is called with the `const service = new NotificationService(new Gateway());`, the following tests are executed. 2 status, 1 news and 3 marketing messages are sent, and a setTimeOut function waits two seconds to attempt sending a third status message, however this exceeds the limit so an error is thrown. If line 57 gets uncommented and the file is executed again, the error is thrown earlier, when the second news message is attempted to be sent. Moreover, if the line 72 is uncommented and line 57 commented again, the error should be thrown when the fourth marketing message tries to be sent. 
