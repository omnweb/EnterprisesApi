
 <h1> Enterprises API</h1>
 <h3>The API was developed using Node.js, Express.js, mongoDB and JSON Web Tokens, for the Ioasys selection process.

The Route Collection is in the postman folder, along with the global environment variable.

Endpoits were created for companies creation, password recovery with email token submission,  creation, updating and deletion of departments and employees.<h3>

<p align="center">
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-use">Use</a>&nbsp;&nbsp;&nbsp; |
  <a href="#-autor">Autor</a>&nbsp;&nbsp;&nbsp;
</p>

<br>


## 🚀 Technologies

Esse projeto foi desenvolvido utilizando as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Express js](https://expressjs.com/pt-br/)
- [Json Web Token](https://jwt.io/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

## 💻 Installation

To install the Enterprises API you will need to have installed mongoDB. 

After cloning the project repository, simply enter the "npm i --save" command so that the packages needed to run the project are installed.

Fill the auth.exemple.json file in the src/app/config folder with a range of random characters, remove the word "example" and save.
Do the same with the file email.example.json. To get smtp data, simply quickly create an account in [mailtrap](https://mailtrap.io/).

To start the api, in the terminal type the command "npm start"

Now simply import the .json files with the route collection and the global variable to check the endpoits.

## 💻 USE

Start by creating a company, through the Add Company route. In this way it is already possible to log in by the Sign in route.

After registering the company it is possible to test the routes of "forgot_password", this route sends an email to the smtp registered at email.json, containing a token, which must be replaced within the "reset_passowd" route.At that time tbm is made the change to the new password.

From here it is already possible to create, update and exude departments and employees, being only necessary to be logged into the api for this.

cê pode visualizar o layout do projeto através dos links abaixo:

## 📝 Autor

<p align="center">Desenvolvido por Ovidio Matiazi Neto</p>
