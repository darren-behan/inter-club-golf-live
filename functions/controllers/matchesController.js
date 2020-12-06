// Defining methods for the usersController

module.exports = {
  findAll(request, response) {
    matches = [
        {
            'id': '1',
            'clubOne': 'newbridge',
            'body': 'home' 
        },
        {
            'id': '2',
            'clubTwo': 'curragh',
            'body': 'away' 
        }
    ]
    return response.json(matches);
  }
}