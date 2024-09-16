[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/AHFn7Vbn)
# Superjoin Hiring Assignment

### Welcome to Superjoin's hiring assignment! 🚀

### Objective
Build a solution that enables real-time synchronization of data between a Google Sheet and a specified database (e.g., MySQL, PostgreSQL). The solution should detect changes in the Google Sheet and update the database accordingly, and vice versa.

### Problem Statement
Many businesses use Google Sheets for collaborative data management and databases for more robust and scalable data storage. However, keeping the data synchronised between Google Sheets and databases is often a manual and error-prone process. Your task is to develop a solution that automates this synchronisation, ensuring that changes in one are reflected in the other in real-time.

### Requirements:
1. Real-time Synchronisation
  - Implement a system that detects changes in Google Sheets and updates the database accordingly.
   - Similarly, detect changes in the database and update the Google Sheet.
  2.	CRUD Operations
   - Ensure the system supports Create, Read, Update, and Delete operations for both Google Sheets and the database.
   - Maintain data consistency across both platforms.
   
### Optional Challenges (This is not mandatory):
1. Conflict Handling
- Develop a strategy to handle conflicts that may arise when changes are made simultaneously in both Google Sheets and the database.
- Provide options for conflict resolution (e.g., last write wins, user-defined rules).
    
2. Scalability: 	
- Ensure the solution can handle large datasets and high-frequency updates without performance degradation.
- Optimize for scalability and efficiency.

## Submission ⏰
The timeline for this submission is: **Next 2 days**

Some things you might want to take care of:
- Make use of git and commit your steps!
- Use good coding practices.
- Write beautiful and readable code. Well-written code is nothing less than a work of art.
- Use semantic variable naming.
- Your code should be organized well in files and folders which is easy to figure out.
- If there is something happening in your code that is not very intuitive, add some comments.
- Add to this README at the bottom explaining your approach (brownie points 😋)
- Use ChatGPT4o/o1/Github Co-pilot, anything that accelerates how you work 💪🏽. 

Make sure you finish the assignment a little earlier than this so you have time to make any final changes.

Once you're done, make sure you **record a video** showing your project working. The video should **NOT** be longer than 120 seconds. While you record the video, tell us about your biggest blocker, and how you overcame it! Don't be shy, talk us through, we'd love that.

We have a checklist at the bottom of this README file, which you should update as your progress with your assignment. It will help us evaluate your project.

- [ ] My code's working just fine! 🥳
- [ ] I have recorded a video showing it working and embedded it in the README ▶️
- [ ] I have tested all the normal working cases 😎
- [ ] I have even solved some edge cases (brownie points) 💪
- [ ] I added my very planned-out approach to the problem at the end of this README 📜

## Got Questions❓
Feel free to check the discussions tab, you might get some help there. Check out that tab before reaching out to us. Also, did you know, the internet is a great place to explore? 😛

We're available at techhiring@superjoin.ai for all queries. 

All the best ✨.

## Developer's Section

# Google Sheets to MySQL Sync Solution

- [✅] My code's working just fine! 🥳
- [✅] I have recorded a video showing it working and embedded it in the README ▶️
- [✅] I have tested all the normal working cases 😎
- [ ] I have even solved some edge cases (brownie points) 💪
- [✅] I added my very planned-out approach to the problem at the end of this README 📜

## Problem and Research

During my research, I explored various tools and technologies to solve the problem of syncing Google Sheets with a MySQL database. The tools I considered were:

1. **Low/No-Code Integration Tools**
2. **Google Apps Script with JDBC**
3. **Node.js Backend with Google Sheets API**

### Chosen Approach

I decided to use MySQL as the database and a Node.js backend due to my familiarity with these tools. This approach also allowed for more flexibility and customization in syncing Google Sheets with MySQL.

---

## Use Case

This solution is designed for **small businesses** that use Google Sheets to maintain records like:

- Product catalogues with inventory details.
- Employee reports.
  
In these cases, **Google Sheets** serves as the **primary frontend** where users input and manage data. The data can later be integrated with:

- A website for public-facing data.
- Internal softwares for management.

---

## Solution Outline

### Initial Steps

I started by creating a basic Node.js server to:

1. **Read** and **Write** data from both Google Sheets and MySQL.
2. Implement a rudimentary sync method using the number of rows to determine what needs to be updated.

---

## StackIt Extension & AppScript Integration

Taing inspiration from Stackit's extension that allows easy remote connection to MySQL databases, I:

- Built an **App Script extension** that takes the MySQL connection details and sends them to an API endpoint.
- Improved sync logic by using **triggers** in Google Apps Script that send requests whenever changes are observed.

I used **local tunnel** to expose my Express server and changed the bind address of the MySQL server for hosting.

---

## Future Scope

Some potential improvements and future steps for this project include:

- **Migrating the backend** from Express to Google Apps Script, so users don’t need to host their own servers.
- **Adding support for more databases**, such as PostgreSQL
- **Setting up database CDC** to detect changes directly from the database using capture on change instead of comparing database states.
- Using **timestamps** to implement "last-write-wins" for concurrent updates between the database and Google Sheets.
- **Optimizing comparison logic** to update specific rows rather than the entire Google Sheet.

---

## Demo

Check out a demo video of the project:  
[![Demo Video](https://drive.google.com/uc?export=view&id=1VeQ7F43WnItwkhYR49klT0NMfsRogH76)](https://drive.google.com/file/d/1VeQ7F43WnItwkhYR49klT0NMfsRogH76/view?usp=sharing)

