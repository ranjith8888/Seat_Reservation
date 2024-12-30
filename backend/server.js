const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dbConfig = require("./app/config/db.config.js");
const { createClient } = require('@supabase/supabase-js');

const app = express();

var corsOptions = {
  origin: "http://localhost:3002",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


const supabaseUrl = 'https://guvejsispsfbdykygevv.supabase.co';
const supabase = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1dmVqc2lzcHNmYmR5a3lnZXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MzIyNzAsImV4cCI6MjA1MTEwODI3MH0.bVlk4bcmh_UmkyOswUhbtf53QADej5Uzi7wCOxoART8');



// simple route
app.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  try {
    const {user,error}= await supabase.from('users').select().eq('email',email);
    if (error) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Authentication successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { name,email, password } = req.body;
  try {

    const { data: result, error } = await supabase.from('users').select().eq('email', email);
    if (result.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data: newUser, error: insertError } = await supabase.from('users').insert([{name,email,password:hashedPassword}]);
    res
      .status(201)
      .json({ message: "success", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/ticket", async (req, res) => {
  const { ticketsRemaining } = req.body.data;

  try {
    const {data:newTicket,error}= await supabase.from('tickets').insert([{ticketsRemaining}]);
    res
      .status(201)
      .json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/ticket", async (req, res) => {
  try {
    const { data: latestTicket, error } = await supabase
    .from('tickets')
    .select()
    .order('created_at', { ascending: false })
    .limit(1);
    console.log(latestTicket);
    res.json({ latestTicket });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
