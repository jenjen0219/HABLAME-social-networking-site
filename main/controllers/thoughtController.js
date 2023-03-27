
//this is what includes the thought and user models
const { Thought, User } = require('../models');


module.exports = {

    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    // Get a single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            //this is excluding the __v field from the response because it isn't relevant in this instance due to the fact that we are not concerned with versioning
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // create a new thought and add it to the user's thoughts array field
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.params.userId },
                    //$push is an operator within MongoDB update query that allows you to add a new iten into an array without overwriting the existing array
                    { $push: { thoughts: thought._id } },
                    //this is passed onto the findOneAndUpdate method, which will return the updated document after the update has been applied
                    { new: true }
                );
            })
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: 'No user with this ID' });
                }
                res.json(user);
            })
            .catch((err) => res.status(500).json(err));


    },

    // Update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            req.body,
            { new: true }
        )
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },

    // Delete a single thought 
    deleteSingleThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },

};

