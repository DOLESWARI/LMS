CREATE DATABASE LMS_DATABASE;
USE LMS_DATABASE;
DROP DATABASE LMS_DATABASE;
SHOW DATABASES;

ALTER DATABASE LMS_DATABASE SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE LMS_DATABASE;
USE master;
DROP DATABASE LMS_DATABASE;

SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';

SELECT name 
FROM sys.databases
WHERE name = 'LMS_DATABASE';

SELECT name 
FROM sys.databases
ORDER BY name;


USE LMS_DATABASE;
DECLARE @sql NVARCHAR(MAX) = '';

SELECT @sql += 'DROP TABLE [' + TABLE_SCHEMA + '].[' + TABLE_NAME + ']; '
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';

EXEC sp_executesql @sql;




USE Master;

DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Instructors;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS InstructorCourseAssignments;
DROP TABLE IF EXISTS StudentCourseAssignments;
DROP TABLE IF EXISTS Courses;



Select * from Products;
Select * from __EFMigrationsHistory;


CREATE PROCEDURE GetProducts
AS
BEGIN
    SELECT Id, Name, Price, Brand 
    FROM Products;
END

DROP PROCEDURE IF EXISTS GetProducts;


CREATE PROCEDURE InsertProduct
    @Name NVARCHAR(MAX),
    @Brand NVARCHAR(MAX),
    @Price DECIMAL(18,2)
AS
BEGIN
    INSERT INTO Products (Name, Brand, Price)
    VALUES (@Name, @Brand, @Price);

    -- Return newly inserted Id
    SELECT SCOPE_IDENTITY() AS NewId;
END



------------------------------------------------------------ Finalized ---------------------------------------------------------------------------

CREATE TABLE Admins (
    admin_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    age INT, 
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at DATETIME DEFAULT GETDATE(),
    
);

select * from Admins;
drop table Admins;

CREATE TABLE Master (
    user_id VARCHAR(20) PRIMARY KEY,                 -- Acts as student_id or instructor_id
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor','admin')),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT, 

    -- Optional fields (NULLable depending on role)
    department VARCHAR(100),     -- for instructors
    course VARCHAR(100),          -- for students
                       
    
    -- Common fields
    phone VARCHAR(20),
    assigned_by_admin VARCHAR(20) NULL,
    assigned_at DATETIME DEFAULT GETDATE(),


    FOREIGN KEY (assigned_by_admin) REFERENCES Admins(admin_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

select * from Master;
drop table Master;






-- Stored Procedure: Add Admin with auto-generated admin_id
CREATE PROCEDURE sp_AddAdmin
    @name VARCHAR(100),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @phone VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @newAdminId VARCHAR(20);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Generate new Admin ID (ADM001, ADM002, ...)
        SELECT @newAdminId = 'ADM' + RIGHT('000' + CAST(ISNULL(MAX(CAST(SUBSTRING(admin_id, 4, LEN(admin_id)) AS INT)), 0) + 1 AS VARCHAR), 3)
        FROM Admins;

        -- Insert into Admins
        INSERT INTO Admins (admin_id, name, email, password, role)
        VALUES (@newAdminId, @name, @email, @password, 'admin');

        -- Insert into Master
        INSERT INTO Master (user_id, role, name, email, password, phone)
        VALUES (@newAdminId, 'admin', @name, @email, @password, @phone);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


EXEC sp_AddAdmin 
    @name = 'Alice',
    @email = 'alice@example.com',
    @password = 'hashedpassword',
    @phone = '1234567890';


select * from Master;
select * from Instructors;


CREATE TABLE Instructors (
    instructor_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    age INT,
    phone VARCHAR(20),
    assigned_by_admin VARCHAR(20),
    assigned_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (assigned_by_admin) REFERENCES Admins(admin_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE Students (
    student_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    course VARCHAR(100),  -- Now properly sized to match Courses.course_id
    age INT,
    phone VARCHAR(20),
    assigned_by_admin VARCHAR(20) NULL,  -- Must be nullable for ON DELETE SET NULL
    assigned_at DATETIME DEFAULT GETDATE(),  -- Use CURRENT_TIMESTAMP if not on SQL Server


    -- Foreign key to Admins
    FOREIGN KEY (assigned_by_admin) REFERENCES Admins(admin_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

Drop table Students;

    CREATE PROCEDURE sp_AddMasterUser
    @role VARCHAR(20),
    @name VARCHAR(100),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @age INT = NULL,
    @department VARCHAR(100) = NULL,
    @course VARCHAR(100) = NULL,
    @phone VARCHAR(20) = NULL,
    @assigned_by_admin VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @prefix VARCHAR(5);
    DECLARE @newId VARCHAR(20);

    -- Decide prefix based on role
    SET @prefix = CASE 
                    WHEN @role = 'student' THEN 'STU'
                    WHEN @role = 'instructor' THEN 'INS'
                    WHEN @role = 'admin' THEN 'ADM'
                  END;

    -- Generate new ID (find max existing number for that role, then +1)
    SELECT @newId = @prefix + RIGHT('000' + CAST(ISNULL(MAX(CAST(SUBSTRING(user_id, 4, 10) AS INT)), 0) + 1 AS VARCHAR), 3)
    FROM Master
    WHERE role = @role;

    -- Insert new record into Master
    INSERT INTO Master (user_id, role, name, email, password, age, department, course, phone, assigned_by_admin)
    VALUES (@newId, @role, @name, @email, @password, @age, @department, @course, @phone, @assigned_by_admin);

    -- Insert into role-specific tables
    IF @role = 'instructor'
    BEGIN
        INSERT INTO Instructors (instructor_id, name, email, password, department, phone, assigned_by_admin)
        VALUES (@newId, @name, @email, @password, @department, @phone, @assigned_by_admin);
    END
    ELSE IF @role = 'student'
    BEGIN
        INSERT INTO Students (student_id, name, email, password, age, course, phone, assigned_by_admin)
        VALUES (@newId, @name, @email, @password, @age, @course, @phone, @assigned_by_admin);
    END
    ELSE IF @role = 'admin'
    BEGIN
        INSERT INTO Admins (admin_id, name, email, password, role)
        VALUES (@newId, @name, @email, @password, 'admin');
    END

    -- Return the generated ID
    SELECT @newId AS GeneratedUserID;
    PRINT 'Data inserted successfully.';
END;


DROP PROCEDURE IF EXISTS sp_AddMasterUser;


-- master, admin, instructor,student




EXEC sp_AddMasterUser 
    @role = 'student',
    @name = 'Alex Johnson',
    @email = 'alex.johnson@lms.com',
    @password = 'Alex@1234',
    @age = 21,
            -- Not needed for student
    @course = 'Information Technology',
    @phone = '9876543210',
    @assigned_by_admin = 'ADM001';  -- Replace with actual admin_id if enforcing FK


EXEC sp_AddMasterUser 
    @role = 'instructor',
    @name = 'Dr. Emily Parker',
    @email = 'emily.parker@lms.com',
    @password = 'Emily@5678',
    @age = 35,
    @department = 'Computer Science',
    @course = NULL,              -- Not needed for instructor
    @phone = '9988776655',
    @assigned_by_admin = 'ADM001';  -- Replace with actual admin_id


 /*   -- Step 1: Find the user ID
SELECT user_id 
FROM Master 
WHERE email = 'alex.johnson@lms.com' AND role = 'student';


DELETE FROM Students
WHERE student_id = 'STU001';  -- Replace with actual ID if different

-- Step 3: Delete from Master table
DELETE FROM Master
WHERE user_id = 'STU002';*/


EXEC sp_AddMasterUser 
    @role = 'admin',
    @name = 'Michael Scott',
    @email = 'michael.scott@lms.com',
    @password = 'Admin@9999',
    @age = 42,
    @department = NULL,
    @course = NULL,
    @phone = '1234567890',
    @assigned_by_admin = NULL;  -- Not required for admins (or could be NULL/default)





--view the master table

CREATE PROCEDURE sp_GetUserDetails
    @role VARCHAR(20),
    @name VARCHAR(100),
    @email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    IF @role = 'student'
    BEGIN
        SELECT 
            M.role,
            M.name,
            M.email,
            M.phone,
            M.course,
            M.age
            
            
        FROM Master M
        WHERE M.role = 'student'
          AND M.name = @name
          AND M.email = @email;
    END
    ELSE IF @role = 'instructor'
    BEGIN
        SELECT 
            M.role,
            M.name,
            M.email,
            M.phone,
            M.department,
            M.age
            
            
        FROM Master M
        WHERE M.role = 'instructor'
          AND M.name = @name
          AND M.email = @email;
    END
    ELSE IF @role = 'admin'
    BEGIN
        SELECT 
            M.role,
            M.name,
            M.email,
            M.phone,
            M.age
            
        FROM Master M
        WHERE M.role = 'admin'
          AND M.name = @name
          AND M.email = @email;
    END
    
END;

DROP PROCEDURE IF EXISTS sp_GetUserDetails;

EXEC sp_GetUserDetails 'student', 'Alex Johnson', 'alex.johnson@lms.com';
EXEC sp_GetUserDetails 'admin','Michael Scott','michael.scott@lms.com';


select * from Master;






CREATE PROCEDURE sp_UpdateMasterUserByRoleAndName
    @role VARCHAR(20),
    @name VARCHAR(100),
    @email VARCHAR(100) = NULL,
    @password VARCHAR(255) = NULL,
    @age INT = NULL,
    @department VARCHAR(100) = NULL,
    @course VARCHAR(100) = NULL,
    @phone VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if exactly one user matches
    IF (SELECT COUNT(*) FROM Master WHERE role = @role AND name = @name) <> 1
    BEGIN
        RAISERROR('User not found or multiple users found with the same role and name.', 16, 1);
        RETURN;
    END

    -- Get the user_id of the matched user
    DECLARE @user_id VARCHAR(20);
    SELECT @user_id = user_id FROM Master WHERE role = @role AND name = @name;

    -- Update Master table
    UPDATE Master
    SET
        email = ISNULL(@email, email),
        password = ISNULL(@password, password),
        age = ISNULL(@age, age),
        phone = ISNULL(@phone, phone),

        department = CASE 
                        WHEN @role = 'instructor' THEN ISNULL(@department, department)
                        WHEN @role = 'admin' THEN NULL
                        ELSE department
                    END,

        course = CASE 
                    WHEN @role = 'student' THEN ISNULL(@course, course)
                    WHEN @role = 'admin' THEN NULL
                    ELSE course
                 END
    WHERE user_id = @user_id;

    -- Update corresponding role-specific table
    IF @role = 'student'
    BEGIN
        -- Assuming you have a Students table and student_id = user_id
        UPDATE Students
        SET
            name = ISNULL(@name, name),
            email = ISNULL(@email, email),
            password = ISNULL(@password, password),
            course = ISNULL(@course, course),
            phone = ISNULL(@phone, phone)
        WHERE student_id = @user_id;
    END
    ELSE IF @role = 'instructor'
    BEGIN
        UPDATE Instructors
        SET
            name = ISNULL(@name, name),
            email = ISNULL(@email, email),
            password = ISNULL(@password, password),
            department = ISNULL(@department, department),
            phone = ISNULL(@phone, phone)
        WHERE instructor_id = @user_id;
    END
    ELSE IF @role = 'admin'
    BEGIN
        UPDATE Admins
        SET
            name = ISNULL(@name, name),
            email = ISNULL(@email, email),
            password = ISNULL(@password, password),
            -- assuming admins don't have phone or age, remove if not in schema
            role = 'admin'
        WHERE admin_id = @user_id;
    END

    PRINT 'User and corresponding role-specific table updated successfully.';
END





select * from Students;
select * from master;

EXEC sp_UpdateMasterUserByRoleAndName
    @role = 'student',
    @name = 'Alex Johnson',
    @course = 'Cyber Security',
    @phone = '1234567890';




DROP PROCEDURE IF EXISTS sp_UpdateMasterUserByRoleAndName;










CREATE TABLE Courses (
    course_id VARCHAR(10) PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    course_image VARCHAR(255)
);

drop table Courses;
select * from Courses;


-- TOPICS TABLE (Each belongs to a Course)
CREATE TABLE Topics (
    topic_id VARCHAR(10),
    course_id VARCHAR(10) NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    description TEXT,
    PRIMARY KEY (course_id, topic_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

drop table Topics;

-- SUBTOPICS TABLE (Each belongs to a Topic under a Course)
CREATE TABLE SubTopics (
    subtopic_id VARCHAR(10),
    course_id VARCHAR(10) NOT NULL,
    topic_id VARCHAR(10) NOT NULL,
    submodule_title VARCHAR(100),
    duration VARCHAR(20),
    video_link VARCHAR(255),
    documentation TEXT,
    description TEXT,
    PRIMARY KEY (course_id, topic_id, subtopic_id),
    FOREIGN KEY (course_id, topic_id)
        REFERENCES Topics(course_id, topic_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

drop table SubTopics;



-- STORAGE PROCEDURE TO INSER IN COURSE TOPIC AND SUBTOPIC 

CREATE PROCEDURE sp_AddCourseWithOptionalTopicSubtopic 
    @p_subject VARCHAR(100),
    @p_duration VARCHAR(50),
    @p_description TEXT,
    @p_start_date DATE,
    @p_end_date DATE,
    @p_course_image VARCHAR(255),

    @p_module_title VARCHAR(255) = NULL,     -- Optional
    @p_module_duration VARCHAR(50) = NULL,
    @p_module_description TEXT = NULL,

    @p_submodule_title VARCHAR(100) = NULL,  -- Optional
    @p_submodule_duration VARCHAR(20) = NULL,
    @p_video_link VARCHAR(255) = NULL,
    @p_documentation TEXT = NULL,
    @p_sub_description TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @new_course_id VARCHAR(10);
    DECLARE @new_topic_id VARCHAR(10);
    DECLARE @new_subtopic_id VARCHAR(10);

    DECLARE @max_course_num INT = 0;
    DECLARE @max_topic_num INT = 0;
    DECLARE @max_subtopic_num INT = 0;

    -- Generate new course_id
    SELECT @max_course_num = ISNULL(MAX(CAST(SUBSTRING(course_id, 2, LEN(course_id)) AS INT)), 0) + 1
    FROM Courses;

    SET @new_course_id = 'C' + RIGHT('000' + CAST(@max_course_num AS VARCHAR), 3);

    -- Insert into Courses
    INSERT INTO Courses (
        course_id, subject, duration, description, start_date, end_date, course_image
    ) VALUES (
        @new_course_id, @p_subject, @p_duration, @p_description, @p_start_date, @p_end_date, @p_course_image
    );

    -- Insert Topic only if module_title is provided
    IF @p_module_title IS NOT NULL AND LTRIM(RTRIM(@p_module_title)) <> ''
    BEGIN
        SELECT @max_topic_num = ISNULL(MAX(CAST(SUBSTRING(topic_id, 2, LEN(topic_id)) AS INT)), 0) + 1
        FROM Topics
        WHERE course_id = @new_course_id;

        SET @new_topic_id = 'T' + RIGHT('000' + CAST(@max_topic_num AS VARCHAR), 3);

        INSERT INTO Topics (
            topic_id, course_id, module_title, duration, description
        ) VALUES (
            @new_topic_id, @new_course_id, @p_module_title, @p_module_duration, @p_module_description
        );

        -- Insert SubTopic only if submodule_title is provided
        IF @p_submodule_title IS NOT NULL AND LTRIM(RTRIM(@p_submodule_title)) <> ''
        BEGIN
            SELECT @max_subtopic_num = ISNULL(MAX(CAST(SUBSTRING(subtopic_id, 2, LEN(subtopic_id)) AS INT)), 0) + 1
            FROM SubTopics
            WHERE course_id = @new_course_id AND topic_id = @new_topic_id;

            SET @new_subtopic_id = 'S' + RIGHT('000' + CAST(@max_subtopic_num AS VARCHAR), 3);

            INSERT INTO SubTopics (
                subtopic_id, course_id, topic_id, submodule_title, duration, video_link, documentation, description
            ) VALUES (
                @new_subtopic_id, @new_course_id, @new_topic_id, @p_submodule_title,
                @p_submodule_duration, @p_video_link, @p_documentation, @p_sub_description
            );
        END
    END
END


DROP PROCEDURE IF EXISTS AddCourseWithOptionalTopicSubtopic;


EXEC sp_AddCourseWithOptionalTopicSubtopic
    @p_subject = 'Computer Science',
    @p_duration = '6 Months',
    @p_description = 'Full-stack development course',
    @p_start_date = '2025-09-15',
    @p_end_date = '2026-03-15',
    @p_course_image = 'cs.jpg',

    @p_module_title = 'Frontend Development',
    @p_module_duration = '2 Months',
    @p_module_description = 'Covers HTML, CSS, JS',

    @p_submodule_title = 'React Basics',
    @p_submodule_duration = '3 Weeks',
    @p_video_link = 'http://videos.com/react',
    @p_documentation = 'React official docs',
    @p_sub_description = 'Intro to React and components';



EXEC sp_AddCourseWithOptionalTopicSubtopic
    @p_subject = 'Web Development',
    @p_duration = '5 Months',
    @p_description = 'Learn how to build websites and web apps',
    @p_start_date = '2025-10-01',
    @p_end_date = '2026-03-01',
    @p_course_image = 'webdev.jpg',

    @p_module_title = 'Backend Development',
    @p_module_duration = '2 Months',
    @p_module_description = 'Covers Node.js, Express, and databases',

    @p_submodule_title = 'MongoDB',
    @p_submodule_duration = '2 Weeks',
    @p_video_link = 'http://videos.com/mongodb',
    @p_documentation = 'MongoDB official docs',
    @p_sub_description = 'Working with NoSQL databases';



    EXEC sp_AddCourseWithOptionalTopicSubtopic
    @p_subject = 'Artificial Intelligence',
    @p_duration = '4 Months',
    @p_description = 'Intro to AI concepts and applications',
    @p_start_date = '2025-11-01',
    @p_end_date = '2026-03-01',
    @p_course_image = 'ai.jpg',

    @p_module_title = 'Machine Learning Basics',
    @p_module_duration = '1.5 Months',
    @p_module_description = 'Supervised and Unsupervised Learning';

    



SELECT * FROM Courses;



-- Stored procedure to updatethe data values in course topic and subtopic 

CREATE PROCEDURE sp_UpdateCourseWithOptionalTopicSubtopic 
    @p_course_id VARCHAR(10),
    @p_subject VARCHAR(100),
    @p_duration VARCHAR(50),
    @p_description TEXT,
    @p_start_date DATE,
    @p_end_date DATE,
    @p_course_image VARCHAR(255),

    @p_module_title VARCHAR(255) = NULL,
    @p_module_duration VARCHAR(50) = NULL,
    @p_module_description TEXT = NULL,

    @p_submodule_title VARCHAR(100) = NULL,
    @p_submodule_duration VARCHAR(20) = NULL,
    @p_video_link VARCHAR(255) = NULL,
    @p_documentation TEXT = NULL,
    @p_sub_description TEXT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @topic_id VARCHAR(10);
    DECLARE @max_topic_num INT = 0;
    DECLARE @max_subtopic_num INT = 0;
    DECLARE @new_topic_id VARCHAR(10);
    DECLARE @new_subtopic_id VARCHAR(10);

    -- 1. Update Course
    UPDATE Courses
    SET
        subject = @p_subject,
        duration = @p_duration,
        description = @p_description,
        start_date = @p_start_date,
        end_date = @p_end_date,
        course_image = @p_course_image
    WHERE course_id = @p_course_id;

    -- 2. If topic info is provided
    IF @p_module_title IS NOT NULL AND LTRIM(RTRIM(@p_module_title)) <> ''
    BEGIN
        IF EXISTS (SELECT 1 FROM Topics WHERE course_id = @p_course_id)
        BEGIN
            -- Update all topics under the course
            UPDATE Topics
            SET
                module_title = @p_module_title,
                duration = @p_module_duration,
                description = @p_module_description
            WHERE course_id = @p_course_id;
        END
        ELSE
        BEGIN
            -- Insert new topic
            SELECT @max_topic_num = ISNULL(MAX(CAST(SUBSTRING(topic_id, 2, LEN(topic_id)) AS INT)), 0) + 1
            FROM Topics
            WHERE course_id = @p_course_id;

            SET @new_topic_id = 'T' + RIGHT('000' + CAST(@max_topic_num AS VARCHAR), 3);

            INSERT INTO Topics (
                topic_id, course_id, module_title, duration, description
            ) VALUES (
                @new_topic_id, @p_course_id, @p_module_title, @p_module_duration, @p_module_description
            );
        END
    END

    -- 3. If subtopic info is provided
    IF @p_submodule_title IS NOT NULL AND LTRIM(RTRIM(@p_submodule_title)) <> ''
    BEGIN
        DECLARE topic_cursor CURSOR FOR
            SELECT topic_id FROM Topics WHERE course_id = @p_course_id;

        OPEN topic_cursor;
        FETCH NEXT FROM topic_cursor INTO @topic_id;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Generate new subtopic ID for this topic
            SELECT @max_subtopic_num = ISNULL(MAX(CAST(SUBSTRING(subtopic_id, 2, LEN(subtopic_id)) AS INT)), 0) + 1
            FROM SubTopics
            WHERE course_id = @p_course_id AND topic_id = @topic_id;

            SET @new_subtopic_id = 'S' + RIGHT('000' + CAST(@max_subtopic_num AS VARCHAR), 3);

            -- Insert new subtopic under this topic
            INSERT INTO SubTopics (
                subtopic_id, course_id, topic_id, submodule_title, duration, video_link, documentation, description
            ) VALUES (
                @new_subtopic_id, @p_course_id, @topic_id, @p_submodule_title,
                @p_submodule_duration, @p_video_link, @p_documentation, @p_sub_description
            );

            FETCH NEXT FROM topic_cursor INTO @topic_id;
        END

        CLOSE topic_cursor;
        DEALLOCATE topic_cursor;
    END
END;



EXEC sp_UpdateCourseWithOptionalTopicSubtopic
    @p_course_id = 'C001',
    @p_subject = 'Updated AI Course',
    @p_duration = '4 Months',
    @p_description = 'Improved syllabus with deep learning',
    @p_start_date = '2025-09-15',
    @p_end_date = '2026-01-15',
    @p_course_image = 'ai_new.jpg',

    @p_module_title = 'Deep Learning',
    @p_module_duration = '2 Months',
    @p_module_description = 'Advanced neural networks',

    @p_submodule_title = 'CNNs in Depth',
    @p_submodule_duration = '2 Weeks',
    @p_video_link = 'https://example.com/cnn-video',
    @p_documentation = 'CNN Guide PDF',
    @p_sub_description = 'Detailed submodule on CNNs';

select * from Courses;


    -- QUERY 1

CREATE PROCEDURE sp_GetCourseFullDetails
    @CourseID VARCHAR(100)
AS
BEGIN
    SELECT
        -- Course Details
        c.course_id,
        c.subject AS course_name,
        c.duration AS course_duration,
        c.description AS course_description,
        c.start_date,
        c.end_date,
        c.course_image,  

        -- Topic Details
        t.topic_id,
        t.module_title AS topic_title,
        t.duration AS topic_duration,
        t.description AS topic_description,

        -- Subtopic Details
        st.subtopic_id,
        st.submodule_title AS subtopic_title,
        st.duration AS subtopic_duration,
        st.video_link,
        st.documentation AS subtopic_documentation,
        st.description AS subtopic_description

    FROM Courses c
    LEFT JOIN Topics t 
        ON c.course_id = t.course_id
    LEFT JOIN SubTopics st 
        ON t.course_id = st.course_id AND t.topic_id = st.topic_id

    WHERE c.course_id = @CourseID
    ORDER BY t.topic_id, st.subtopic_id;
END;

DROP PROCEDURE sp_GetCourseFullDetails;



EXEC sp_GetCourseFullDetails @CourseID = 'C001';










/*
SELECT
    c.course_id,
    c.subject AS course_name,
    c.duration AS course_duration,
    c.description AS course_description,
    c.start_date,
    c.end_date,
    c.course_image,

    t.topic_id,
    t.module_title AS topic_title,
    t.duration AS topic_duration,
    t.description AS topic_description,

    st.subtopic_id,
    st.submodule_title AS subtopic_title,
    st.duration AS subtopic_duration,
    st.video_link,
    st.documentation AS subtopic_documentation,
    st.description AS subtopic_description

FROM Courses c
LEFT JOIN Topics t 
    ON c.course_id = t.course_id
LEFT JOIN SubTopics st 
    ON t.course_id = st.course_id AND t.topic_id = st.topic_id

WHERE c.course_id = 'C001' -- Replace with a real course_id
ORDER BY t.topic_id, st.subtopic_id;
*/





CREATE TABLE InstructorCourseAssignments (
    assignment_id VARCHAR(20) PRIMARY KEY,
    instructor_id VARCHAR(20) NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    assigned_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        ON DELETE NO ACTION  -- Changed here
        ON UPDATE CASCADE,

    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
        ON DELETE CASCADE  -- Keep cascade here for cleanup on course delete
        ON UPDATE CASCADE
);


DROP TABLE IF EXISTS InstructorCourseAssignments;



CREATE TABLE StudentCourseAssignments (
    assignment_id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    enrolled_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (student_id) REFERENCES Students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
        ON DELETE CASCADE  -- Keep cascade here for cleanup on course delete
        ON UPDATE CASCADE
    
);


DROP TABLE IF EXISTS StudentCourseAssignments;


select * from InstructorCourseAssignments;
select * from StudentCourseAssignments;

SELECT * FROM Admins;
SELECT * FROM Instructors;
SELECT * FROM Students;
SELECT * FROM master;
select * from Courses;


CREATE PROCEDURE sp_AssignInstructorToCourse
    @InstructorID VARCHAR(20),
    @CourseID VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NextID INT;
    DECLARE @NewAssignmentID VARCHAR(20);

    -- Get the current maximum numeric part of assignment_id
    SELECT @NextID = 
        ISNULL(MAX(CAST(SUBSTRING(assignment_id, 5, LEN(assignment_id)) AS INT)), 0) + 1
    FROM InstructorCourseAssignments;

    -- Generate new ID in the format ASS_001, ASS_002, etc.
    SET @NewAssignmentID = 'InsASScor_' + RIGHT('000' + CAST(@NextID AS VARCHAR), 3);

    -- Insert into the table with the generated ID
    INSERT INTO InstructorCourseAssignments (assignment_id, instructor_id, course_id)
    VALUES (@NewAssignmentID, @InstructorID, @CourseID);
END;


DROP PROCEDURE sp_AssignInstructorToCourse;


CREATE PROCEDURE sp_EnrollStudentInCourse
    @StudentID VARCHAR(20),
    @CourseID VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NewID VARCHAR(20);
    DECLARE @MaxID INT;

    -- Get the max numeric part from existing assignment_id
    SELECT @MaxID = 
        MAX(CAST(SUBSTRING(assignment_id, 8, LEN(assignment_id)) AS INT))
    FROM StudentCourseAssignments;

    -- Handle NULL (if no rows yet)
    SET @MaxID = ISNULL(@MaxID, 0) + 1;

    -- Format new assignment ID (e.g., ASSIGN_001)
    SET @NewID = 'StrASScor_' + RIGHT('000' + CAST(@MaxID AS VARCHAR), 3);

    -- Insert into table
    INSERT INTO StudentCourseAssignments (assignment_id, student_id, course_id)
    VALUES (@NewID, @StudentID, @CourseID);
END;




DROP PROCEDURE sp_EnrollStudentInCourse;



-- Assign instructor
EXEC sp_AssignInstructorToCourse @InstructorID = 'INS001', @CourseID = 'C001';
--EXEC AssignInstructorToCourse @InstructorID = 'INS003', @CourseID = 'C002';

-- Enroll student
EXEC sp_EnrollStudentInCourse @StudentID = 'STU001', @CourseID = 'C001';
--EXEC EnrollStudentInCourse @StudentID = 'STU002', @CourseID = 'C002';



-- QUERY 5  -> ADMIN PART TO SEE WHICH COURSE, WHICH INSTRUCTOR AND WHICH STUDENT ASSIGNED

SELECT 
    c.course_id,
    c.subject AS course_name,
    i.instructor_id,
    i.name AS instructor_name,
    s.student_id,
    s.name AS student_name
FROM Courses c

-- Join instructors assigned to course
LEFT JOIN InstructorCourseAssignments ica ON c.course_id = ica.course_id
LEFT JOIN Instructors i ON ica.instructor_id = i.instructor_id

-- Join students assigned to course
LEFT JOIN StudentCourseAssignments sca ON c.course_id = sca.course_id
LEFT JOIN Students s ON sca.student_id = s.student_id

ORDER BY c.course_id, i.instructor_id, s.student_id;



CREATE PROCEDURE sp_AdminGetCourseInstructorDetails
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.course_id,
        c.subject AS course_name,
        i.instructor_id,
        i.name AS instructor_name,
        s.student_id,
        s.name AS student_name
    FROM Courses c

    -- Join instructors assigned to course
    LEFT JOIN InstructorCourseAssignments ica ON c.course_id = ica.course_id
    LEFT JOIN Instructors i ON ica.instructor_id = i.instructor_id

    -- Join students assigned to course
    LEFT JOIN StudentCourseAssignments sca ON c.course_id = sca.course_id
    LEFT JOIN Students s ON sca.student_id = s.student_id

    ORDER BY c.course_id, i.instructor_id, s.student_id;
END;

EXEC sp_AdminGetCourseInstructorDetails;



-- QUERY 6  for instructor to see which course enrolled

SELECT 
    c.course_id,
    c.subject,
    c.duration,
    c.description,
    c.start_date,
    c.end_date,
    c.course_image,
    ica.instructor_id
FROM Courses c
INNER JOIN InstructorCourseAssignments ica
    ON c.course_id = ica.course_id
INNER JOIN Instructors i
    ON ica.instructor_id = i.instructor_id;



    CREATE PROCEDURE sp_GetCoursesWithInstructorsEnrolled
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.course_id,
        c.subject,
        c.duration,
        c.description,
        c.start_date,
        c.end_date,
        c.course_image,
        ica.instructor_id
    FROM Courses c
    INNER JOIN InstructorCourseAssignments ica
        ON c.course_id = ica.course_id
    INNER JOIN Instructors i
        ON ica.instructor_id = i.instructor_id;
END;

EXEC sp_GetCoursesWithInstructorsEnrolled;




-- QUERY 7  for student to see which course enrolled


SELECT 
    c.course_id,
    c.subject,
    c.duration,
    c.description,
    c.start_date,
    c.end_date,
    c.course_image,
    sca.student_id
FROM Courses c
INNER JOIN StudentCourseAssignments sca
    ON c.course_id = sca.course_id
INNER JOIN Students s
    ON sca.student_id = s.student_id;



CREATE PROCEDURE sp_GetCoursesWithStudentsEnrolled
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.course_id,
        c.subject,
        c.duration,
        c.description,
        c.start_date,
        c.end_date,
        c.course_image,
        sca.student_id
    FROM Courses c
    INNER JOIN StudentCourseAssignments sca
        ON c.course_id = sca.course_id
    INNER JOIN Students s
        ON sca.student_id = s.student_id;
END;





-- QUERY 17  for the instructor see which student enrolled under him

SELECT 
    s.name AS student_name,
    s.email,
    s.age,
    s.phone,
    c.course_id,
    c.subject AS course_name
FROM Students s
INNER JOIN StudentCourseAssignments sca
    ON s.student_id = sca.student_id
INNER JOIN Courses c
    ON sca.course_id = c.course_id
INNER JOIN InstructorCourseAssignments ica
    ON c.course_id = ica.course_id
WHERE ica.instructor_id = 'INS001';  -- replace with the instructor_id you want





CREATE PROCEDURE sp_GetStudentsByInstructor
    @InstructorID VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        s.name AS student_name,
        s.email,
        s.age,
        s.phone,
        c.course_id,
        c.subject AS course_name
    FROM Students s
    INNER JOIN StudentCourseAssignments sca
        ON s.student_id = sca.student_id
    INNER JOIN Courses c
        ON sca.course_id = c.course_id
    INNER JOIN InstructorCourseAssignments ica
        ON c.course_id = ica.course_id
    WHERE ica.instructor_id = @InstructorID;
END;



EXEC sp_GetStudentsByInstructor @InstructorID = 'INS001';



-- QUERY 18  for the student to see which instructor enrolled under which course that he/she is enrolled 


SELECT 
    i.name AS instructor_name,
    i.email AS instructor_email,
    i.phone AS instructor_phone,
    c.course_id,
    c.subject AS course_name
FROM Students s
INNER JOIN StudentCourseAssignments sca
    ON s.student_id = sca.student_id
INNER JOIN Courses c
    ON sca.course_id = c.course_id
INNER JOIN InstructorCourseAssignments ica
    ON c.course_id = ica.course_id
INNER JOIN Instructors i
    ON ica.instructor_id = i.instructor_id
WHERE s.student_id = 'STU001';  -- replace with the student_id you want



-- QUERY 19   instructor can see: Which courses he/she teaches   And for those courses, which students are enrolled

SELECT 
    i.instructor_id,
    i.name AS instructor_name,
    c.course_id,
    c.subject,
    s.student_id,
    s.name AS student_name
    --s.email AS student_email
FROM Instructors i
INNER JOIN InstructorCourseAssignments ica 
    ON i.instructor_id = ica.instructor_id
INNER JOIN Courses c 
    ON ica.course_id = c.course_id
LEFT JOIN StudentCourseAssignments sca 
    ON c.course_id = sca.course_id
LEFT JOIN Students s 
    ON sca.student_id = s.student_id
WHERE i.instructor_id = 'INS001';   -- put instructor id here





















-- Assignments table
CREATE TABLE Assignments (
    assignment_id VARCHAR(20) PRIMARY KEY,
    topic_id VARCHAR(10) NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    instructor_id VARCHAR(20) NOT NULL,
    description TEXT,
    file_link VARCHAR(255),
    due_date DATE NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (course_id, topic_id) REFERENCES Topics(course_id, topic_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Assignment Submissions by students
CREATE TABLE AssignmentSubmissions (
    submission_id VARCHAR(20) PRIMARY KEY,
    assignment_id VARCHAR(20) NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    submitted_at DATETIME DEFAULT GETDATE(),
    file_link VARCHAR(255),
    grade VARCHAR(10),
    feedback TEXT,

    FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE ,
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
        
);

DROP TABLE AssignmentSubmissions;




-- Tests table
CREATE TABLE Tests (
    test_id VARCHAR(20) PRIMARY KEY,
    topic_id VARCHAR(10) NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    instructor_id VARCHAR(20) NOT NULL,
    description TEXT Not null,
    total_marks INT NOT NULL,
    test_date DATE NOT NULL,
    duration_minutes INT,
    file_link VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (course_id, topic_id) REFERENCES Topics(course_id, topic_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);



-- Student Test Attempts
CREATE TABLE TestSubmissions (
    submission_id VARCHAR(20) PRIMARY KEY,
    test_id VARCHAR(20) NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    submitted_at DATETIME DEFAULT GETDATE(),
    obtained_marks INT,
    grade VARCHAR(10),
    feedback TEXT,

    FOREIGN KEY (test_id) REFERENCES Tests(test_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
       
);
DROP TABLE TestSubmissions;

select * from Courses;


CREATE PROCEDURE sp_AddAssignmentByNames
    @InstructorID VARCHAR(20),
    @CourseSubject VARCHAR(100),      -- Changed from CourseName to CourseSubject to match 'subject' column
    @TopicTitle VARCHAR(255),
    @AssignmentDescription TEXT,
    @FileLink VARCHAR(255),
    @DueDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CourseID VARCHAR(10);
    DECLARE @TopicID VARCHAR(10);
    DECLARE @NewAssignmentID VARCHAR(20);

    -- Step 1: Get Course ID from Course Subject
    SELECT @CourseID = course_id
    FROM Courses
    WHERE subject = @CourseSubject;

    IF @CourseID IS NULL
    BEGIN
        RAISERROR('Course subject "%s" does not exist.', 16, 1, @CourseSubject);
        RETURN;
    END

    -- Step 2: Check if Instructor is assigned to the Course
    IF NOT EXISTS (
        SELECT 1 FROM InstructorCourseAssignments
        WHERE instructor_id = @InstructorID AND course_id = @CourseID
    )
    BEGIN
        RAISERROR('Instructor is not assigned to the course "%s".', 16, 1, @CourseSubject);
        RETURN;
    END

    -- Step 3: Get Topic ID using Course ID and Module Title
    SELECT @TopicID = topic_id
    FROM Topics
    WHERE course_id = @CourseID AND module_title = @TopicTitle;

    IF @TopicID IS NULL
    BEGIN
        RAISERROR('Topic "%s" does not exist under course "%s".', 16, 1, @TopicTitle, @CourseSubject);
        RETURN;
    END

    -- Step 4: Generate Assignment ID like ASS_001
    SELECT @NewAssignmentID = 'ASS_' + RIGHT('000' + CAST(
        ISNULL(MAX(CAST(SUBSTRING(assignment_id, 5, LEN(assignment_id)) AS INT)), 0) + 1 AS VARCHAR), 3)
    FROM Assignments;

    -- Step 5: Insert into Assignments table
    INSERT INTO Assignments (
        assignment_id,
        topic_id,
        course_id,
        instructor_id,
        description,
        file_link,
        due_date,
        created_at
    )
    VALUES (
        @NewAssignmentID,
        @TopicID,
        @CourseID,
        @InstructorID,
        @AssignmentDescription,
        @FileLink,
        @DueDate,
        GETDATE()
    );

    PRINT 'Assignment created successfully with ID: ' + @NewAssignmentID;
END;

DROP PROCEDURE sp_AddAssignmentByNames;

select * from Topics;

EXEC sp_AddAssignmentByNames
    @InstructorID = 'INS001',
    @CourseSubject = 'Updated AI Course',
    @TopicTitle = 'Deep Learning',
    @AssignmentDescription = 'Assignment covering recursion with C++ examples.',
    @FileLink = 'http://example.com/recursion.pdf',
    @DueDate = '2025-09-15';




    CREATE PROCEDURE sp_AddTestByNames
    @InstructorID VARCHAR(20),
    @CourseSubject VARCHAR(100),
    @TopicTitle VARCHAR(255),
    @TestDescription TEXT,
    @TotalMarks INT,
    @TestDate DATE,
    @DurationMinutes INT = NULL,
    @FileLink VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CourseID VARCHAR(10);
    DECLARE @TopicID VARCHAR(10);
    DECLARE @NewTestID VARCHAR(20);

    -- Step 1: Get Course ID from Course Subject
    SELECT @CourseID = course_id
    FROM Courses
    WHERE subject = @CourseSubject;

    IF @CourseID IS NULL
    BEGIN
        RAISERROR('Course subject "%s" does not exist.', 16, 1, @CourseSubject);
        RETURN;
    END

    -- Step 2: Check if Instructor is assigned to the Course
    IF NOT EXISTS (
        SELECT 1 FROM InstructorCourseAssignments
        WHERE instructor_id = @InstructorID AND course_id = @CourseID
    )
    BEGIN
        RAISERROR('Instructor is not assigned to the course "%s".', 16, 1, @CourseSubject);
        RETURN;
    END

    -- Step 3: Get Topic ID using Course ID and Module Title
    SELECT @TopicID = topic_id
    FROM Topics
    WHERE course_id = @CourseID AND module_title = @TopicTitle;

    IF @TopicID IS NULL
    BEGIN
        RAISERROR('Topic "%s" does not exist under course "%s".', 16, 1, @TopicTitle, @CourseSubject);
        RETURN;
    END

    -- Step 4: Generate Test ID like TEST_001
    SELECT @NewTestID = 'TEST_' + RIGHT('000' + CAST(
        ISNULL(MAX(CAST(SUBSTRING(test_id, 6, LEN(test_id)) AS INT)), 0) + 1 AS VARCHAR), 3)
    FROM Tests;

    -- Step 5: Insert into Tests table
    INSERT INTO Tests (
        test_id,
        topic_id,
        course_id,
        instructor_id,
        description,
        total_marks,
        test_date,
        duration_minutes,
        file_link,
        created_at
    )
    VALUES (
        @NewTestID,
        @TopicID,
        @CourseID,
        @InstructorID,
        @TestDescription,
        @TotalMarks,
        @TestDate,
        @DurationMinutes,
        @FileLink,
        GETDATE()
    );

    PRINT 'Test created successfully with ID: ' + @NewTestID;
END;



EXEC sp_AddTestByNames
    @InstructorID = 'INS001',
    @CourseSubject = 'Updated AI Course',
    @TopicTitle = 'Deep Learning',
    @TestDescription = 'MCQ test on Deep Learning.',
    @TotalMarks = 50,
    @TestDate = '2025-09-20',
    @DurationMinutes = 60,
    @FileLink = 'http://example.com/tests/osi_model.pdf';


























---------------------------------------------------------------------- OLD START  ------------------------------------------------------------

---------------------------------------------------------------------------------------------

-- COURSES TABLE
CREATE TABLE Courses (
    course_id VARCHAR(10) PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    course_image VARCHAR(255)
);

drop table Courses;

-- TOPICS TABLE (Each belongs to a Course)
CREATE TABLE Topics (
    topic_id VARCHAR(10),
    course_id VARCHAR(10) NOT NULL,
    module_title VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    description TEXT,
    PRIMARY KEY (course_id, topic_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

drop table Topics;

-- SUBTOPICS TABLE (Each belongs to a Topic under a Course)
CREATE TABLE SubTopics (
    subtopic_id VARCHAR(10),
    course_id VARCHAR(10) NOT NULL,
    topic_id VARCHAR(10) NOT NULL,
    submodule_title VARCHAR(100),
    duration VARCHAR(20),
    video_link VARCHAR(255),
    documentation TEXT,
    description TEXT,
    PRIMARY KEY (course_id, topic_id, subtopic_id),
    FOREIGN KEY (course_id, topic_id)
        REFERENCES Topics(course_id, topic_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

drop table SubTopics;
select * from Courses;


-- QUERY 1
SELECT
    -- Course Details
    c.course_id,
    c.subject AS course_name,
    c.description AS course_description,
    c.duration AS course_duration,
    c.start_date,
    c.end_date,
    c.course_image,

    -- Topic Details
    t.topic_id,
    t.module_title AS topic_title,
    t.description AS topic_description,
    t.duration AS topic_duration,

    -- Subtopic Details
    st.subtopic_id,
    st.submodule_title AS subtopic_title,
    st.duration AS subtopic_duration,
    st.description AS subtopic_description,
    st.video_link,
    st.documentation AS subtopic_documentation
    

FROM Courses c
LEFT JOIN Topics t 
    ON c.course_id = t.course_id
LEFT JOIN SubTopics st 
    ON t.course_id = st.course_id AND t.topic_id = st.topic_id

WHERE c.course_id = 'C001'  -- Replace this with any course ID
ORDER BY t.topic_id, st.subtopic_id;




-- QUERY 2

SELECT
    t.topic_id,
    t.module_title,
    t.duration AS topic_duration,
    t.description AS topic_description,
    st.subtopic_id,
    st.submodule_title,
    st.description AS subtopic_description,
    st.duration AS subtopic_duration
    
FROM Topics t
LEFT JOIN SubTopics st 
    ON t.course_id = st.course_id AND t.topic_id = st.topic_id
WHERE t.course_id = 'C001'
ORDER BY t.topic_id, st.subtopic_id;


-- QUERY 3

SELECT 
    subtopic_id,
    submodule_title,
    description,
    duration,
    video_link,
    documentation

FROM SubTopics
WHERE course_id = 'C001' AND topic_id = 'T001';

-- QUERY 4

SELECT *
FROM SubTopics
WHERE course_id = 'C001' AND topic_id = 'T001' AND subtopic_id = 'ST001';


-- QUERY 8

SELECT 
    c.course_id,
    c.subject AS course_name,
    c.course_image,
    t.description,
    t.topic_id,
    t.module_title,
    t.duration
    
FROM Courses c
JOIN Topics t ON c.course_id = t.course_id
WHERE c.course_id = 'C001';  -- Replace this with the actual course ID clicked


-- QUERY 9

SELECT 
    -- Course details
    c.course_id,
    c.subject AS course_name,
    c.description AS course_description,
    c.duration AS course_duration,
    c.start_date,
    c.end_date,
    c.course_image,

    -- Topic info
    t.topic_id,
    t.module_title AS topic_title,
    t.description AS topic_description,
    t.duration AS topic_duration,
    

    -- Subtopic info
    s.subtopic_id,
    s.submodule_title,
    s.description AS subtopic_description,
    s.duration AS subtopic_duration,
    s.video_link,
    s.documentation
    

FROM Topics t
JOIN Courses c ON t.course_id = c.course_id
LEFT JOIN SubTopics s ON t.course_id = s.course_id AND t.topic_id = s.topic_id

WHERE t.topic_id = 'T001';  -- Replace with actual topic ID

-- QUERY 10

SELECT 
    -- Course details
    c.course_id,
    c.subject AS course_name,
    c.description AS course_description,
    c.duration AS course_duration,
    c.start_date,
    c.end_date,
    c.course_image,
    -- Topic info
    t.topic_id,
    t.module_title AS topic_title,
    t.description AS topic_description,
    t.duration AS topic_duration,
    

    -- Only Subtopic name
    s.subtopic_id,
    s.submodule_title AS subtopic_name

FROM Topics t
JOIN Courses c ON t.course_id = c.course_id
LEFT JOIN SubTopics s 
    ON t.course_id = s.course_id 
   AND t.topic_id = s.topic_id

WHERE t.topic_id = 'T001';  -- Replace with the actual topic ID


-- QUERY 11

SELECT 
    -- Course details
    c.course_id,
    c.subject AS course_name,
    c.description AS course_description,
    c.duration AS course_duration,
    c.start_date,
    c.end_date,
    c.course_image,
    -- Topic details
    t.topic_id,
    t.module_title AS topic_title,
    t.description AS topic_description,
    t.duration AS topic_duration,
    

    -- SubTopic details
    s.subtopic_id,
    s.submodule_title,
    s.description AS subtopic_description,
    s.duration AS subtopic_duration,
    s.video_link,
    s.documentation
    

FROM SubTopics s
JOIN Topics t 
    ON s.course_id = t.course_id 
   AND s.topic_id = t.topic_id
JOIN Courses c 
    ON s.course_id = c.course_id

WHERE s.subtopic_id = 'ST001';  -- Replace with actual subtopic ID




-- QUERY 12
-- QUERY 13
-- QUERY 14
-- QUERY 15
-- QUERY 16
















-- Insert sample courses
INSERT INTO Courses (course_id, subject, duration, description, start_date, end_date, course_image)
VALUES
('C001', 'Mathematics', '3 months', 'Basic Mathematics Course', '2025-01-01', '2025-03-31', '/images/math.jpg'),
('C002', 'Physics', '4 months', 'Introductory Physics', '2025-02-01', '2025-05-31', '/images/physics.png');


-- Insert sample topics for course C001
INSERT INTO Topics (course_id, topic_id, module_title, duration, description)
VALUES
('C001', 'T001', 'Algebra', '1 month', 'Fundamentals of Algebra'),
('C001', 'T002', 'Geometry', '2 months', 'Introduction to Geometry');

-- Insert sample topics for course C002
INSERT INTO Topics (course_id, topic_id, module_title, duration, description)
VALUES
('C002', 'T001', 'Mechanics', '2 months', 'Basics of Mechanics'),
('C002', 'T002', 'Optics', '2 months', 'Study of light');

-- Insert sample subtopics for course C001, topic T001 (Algebra)
INSERT INTO SubTopics (course_id, topic_id, subtopic_id, submodule_title, duration, video_link, documentation, description)
VALUES
('C001', 'T001', 'ST001', 'Linear Equations', '1 week', 'http://video.link/linear', 'Linear equations docs', 'Introduction to linear equations'),
('C001', 'T001', 'ST002', 'Quadratic Equations', '1 week', 'http://video.link/quadratic', 'Quadratic docs', 'Understanding quadratic equations');

-- Insert sample subtopics for course C001, topic T002 (Geometry)
INSERT INTO SubTopics (course_id, topic_id, subtopic_id, submodule_title, duration, video_link, documentation, description)
VALUES
('C001', 'T002', 'ST001', 'Triangles', '2 weeks', 'http://video.link/triangles', 'Triangles docs', 'Basics of triangles'),
('C001', 'T002', 'ST002', 'Circles', '2 weeks', 'http://video.link/circles', 'Circles docs', 'Properties of circles');

-- Insert sample subtopics for course C002, topic T001 (Mechanics)
INSERT INTO SubTopics (course_id, topic_id, subtopic_id, submodule_title, duration, video_link, documentation, description)
VALUES
('C002', 'T001', 'ST001', 'Newtons Laws', '2 weeks', 'http://video.link/newton', 'Newton docs', 'Newton laws of motion');




-----------------------------------------------------------------------------------------------------------------------------------------







CREATE TABLE Master (
    user_id VARCHAR(20) PRIMARY KEY,                 -- Acts as student_id or instructor_id
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor','admin')),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL UNIQUE,
    age INT, 

    -- Optional fields (NULLable depending on role)
    department VARCHAR(100),     -- for instructors
    course VARCHAR(10),          -- for students
                       
    
    -- Common fields
    phone VARCHAR(20),
    assigned_by_admin VARCHAR(20) NULL,
    assigned_at DATETIME DEFAULT GETDATE(),


    FOREIGN KEY (assigned_by_admin) REFERENCES Admins(admin_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

select * from Master;

drop table Master;


INSERT INTO Master (user_id, role, name, email, password, department, phone, assigned_by_admin)
VALUES 
('I001', 'instructor', 'John Doe', 'john.doe@edu.com', 'pass123', 'Computer Science', '1234567890', 'A001'),
('I002', 'instructor', 'Jane Lee', 'jane.lee@edu.com', 'pass456', 'Data Analytics', '9876543210', 'A002');

-- Insert Students into Master
INSERT INTO Master (user_id, role, name, email, password, course, age, phone, assigned_by_admin)
VALUES 
('S001', 'student', 'Michael Brown', 'michael@edu.com', 'stud123', 'C001', 22, '5551234567', 'A001'),
('S002', 'student', 'Laura Green', 'laura@edu.com', 'stud456', 'C002', 25, '5557654321', 'A002');



CREATE PROCEDURE sp_AddMasterUser
    @role VARCHAR(20),
    @name VARCHAR(100),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @age INT = NULL,
    @department VARCHAR(100) = NULL,
    @course VARCHAR(10) = NULL,
    @phone VARCHAR(20) = NULL,
    @assigned_by_admin VARCHAR(20) = NULL
AS
BEGIN
    DECLARE @prefix VARCHAR(5);
    DECLARE @newId VARCHAR(20);

    -- Decide prefix based on role
    SET @prefix = CASE 
                    WHEN @role = 'student' THEN 'STU'
                    WHEN @role = 'instructor' THEN 'INS'
                    WHEN @role = 'admin' THEN 'ADM'
                  END;

    -- Generate new id (take max number from same role and +1)
    SELECT @newId = @prefix + RIGHT('000' + CAST(ISNULL(MAX(CAST(SUBSTRING(user_id, 4, 10) AS INT)), 0) + 1 AS VARCHAR), 3)
    FROM Master
    WHERE role = @role;

    -- Insert record
    INSERT INTO Master (user_id, role, name, email, password, age, department, course, phone, assigned_by_admin)
    VALUES (@newId, @role, @name, @email, @password, @age, @department, @course, @phone, @assigned_by_admin);

    -- Return new id
    SELECT @newId AS GeneratedUserID;
END;


DROP PROCEDURE IF EXISTS sp_AddMasterUser;


CREATE PROCEDURE sp_AddMasterUser
    @role VARCHAR(20),
    @name VARCHAR(100),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @age INT = NULL,
    @department VARCHAR(100) = NULL,
    @course VARCHAR(10) = NULL,
    @phone VARCHAR(20) = NULL,
    @assigned_by_admin VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @prefix VARCHAR(5);
    DECLARE @newId VARCHAR(20);

    -- Decide prefix based on role
    SET @prefix = CASE 
                    WHEN @role = 'student' THEN 'STU'
                    WHEN @role = 'instructor' THEN 'INS'
                    WHEN @role = 'admin' THEN 'ADM'
                  END;

    -- Generate new ID (find max existing number for that role, then +1)
    SELECT @newId = @prefix + RIGHT('000' + CAST(ISNULL(MAX(CAST(SUBSTRING(user_id, 4, 10) AS INT)), 0) + 1 AS VARCHAR), 3)
    FROM Master
    WHERE role = @role;

    -- Insert new record
    INSERT INTO Master (user_id, role, name, email, password, age, department, course, phone, assigned_by_admin)
    VALUES (@newId, @role, @name, @email, @password, @age, @department, @course, @phone, @assigned_by_admin);

    -- Return the generated ID
    SELECT @newId AS GeneratedUserID;
END;



EXEC sp_AddMasterUser 
    @role = 'instructor',
    @name = 'Alice',
    @email = 'alice11@example.com',
    @password = 'pass11123',
    @age = 20,
    @course = 'CSE101';














EXEC sp_AddMasterUser 
    @role = 'instructor',
    @name = 'Aliceer',
    @email = 'alicri@example.com',
    @password = 'fopas1523',
    @age = 20,
    @course = 'CSE101';




    CREATE PROCEDURE sp_AddMasterUser
    @role VARCHAR(20),
    @name VARCHAR(100),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @age INT = NULL,
    @department VARCHAR(100) = NULL,
    @course VARCHAR(10) = NULL,
    @phone VARCHAR(20) = NULL,
    @assigned_by_admin VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @prefix VARCHAR(5);
    DECLARE @newId VARCHAR(20);

    -- Decide prefix based on role
    SET @prefix = CASE 
                    WHEN @role = 'student' THEN 'STU'
                    WHEN @role = 'instructor' THEN 'INS'
                    WHEN @role = 'admin' THEN 'ADM'
                  END;

    -- Generate new ID (find max existing number for that role, then +1)
    SELECT @newId = @prefix + RIGHT('000' + CAST(ISNULL(MAX(CAST(SUBSTRING(user_id, 4, 10) AS INT)), 0) + 1 AS VARCHAR), 3)
    FROM Master
    WHERE role = @role;

    -- Insert new record into Master
    INSERT INTO Master (user_id, role, name, email, password, age, department, course, phone, assigned_by_admin)
    VALUES (@newId, @role, @name, @email, @password, @age, @department, @course, @phone, @assigned_by_admin);

    -- Insert into role-specific tables
    IF @role = 'instructor'
    BEGIN
        INSERT INTO Instructors (instructor_id, name, email, password, department, phone, assigned_by_admin)
        VALUES (@newId, @name, @email, @password, @department, @phone, @assigned_by_admin);
    END
    ELSE IF @role = 'student'
    BEGIN
        INSERT INTO Students (student_id, name, email, password, age, course, phone, assigned_by_admin)
        VALUES (@newId, @name, @email, @password, @age, @course, @phone, @assigned_by_admin);
    END
    ELSE IF @role = 'admin'
    BEGIN
        INSERT INTO Admins (admin_id, name, email, password, role)
        VALUES (@newId, @name, @email, @password, 'admin');
    END

    -- Return the generated ID
    SELECT @newId AS GeneratedUserID;
END;























-- Stored Procedure: Add Admin with auto-generated admin_id
CREATE PROCEDURE sp_AddAdmin
    @name VARCHAR(100),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @phone VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @newAdminId VARCHAR(20);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Generate new Admin ID (ADM001, ADM002, ...)
        SELECT @newAdminId = 'ADM' + RIGHT('000' + CAST(ISNULL(MAX(CAST(SUBSTRING(admin_id, 4, LEN(admin_id)) AS INT)), 0) + 1 AS VARCHAR), 3)
        FROM Admins;

        -- Insert into Admins
        INSERT INTO Admins (admin_id, name, email, password, role)
        VALUES (@newAdminId, @name, @email, @password, 'admin');

        -- Insert into Master
        INSERT INTO Master (user_id, role, name, email, password, phone)
        VALUES (@newAdminId, 'admin', @name, @email, @password, @phone);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO


EXEC sp_AddAdmin 
    @name = 'Alice',
    @email = 'alice@example.com',
    @password = 'hashedpassword',
    @phone = '1234567890';


select * from Master;


select * from Admins;














-- Procedure: Add Admin
CREATE PROCEDURE sp_AddAdmin
    @admin_id VARCHAR(20),
    @name VARCHAR(100),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @role VARCHAR(50) = 'admin'
AS
BEGIN
    -- Insert into Admins
    INSERT INTO Admins (admin_id, name, email, password, role)
    VALUES (@admin_id, @name, @email, @password, @role);

    -- Insert into Master
    INSERT INTO Master (user_id, role, name, email, password)
    VALUES (@admin_id, 'admin', @name, @email, @password);
END;
GO


-- Procedure: Update Admin
CREATE PROCEDURE sp_UpdateAdmin
    @admin_id VARCHAR(20),
    @name VARCHAR(100),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @role VARCHAR(50) = 'admin'
AS
BEGIN
    -- Update Admins
    UPDATE Admins
    SET name = @name,
        email = @email,
        password = @password,
        role = @role
    WHERE admin_id = @admin_id;

    -- Update Master
    UPDATE Master
    SET name = @name,
        email = @email,
        password = @password
    WHERE user_id = @admin_id;
END;
GO


-- Procedure: Delete Admin
CREATE PROCEDURE sp_DeleteAdmin
    @admin_id VARCHAR(20)
AS
BEGIN
    -- Delete from Admins
    DELETE FROM Admins
    WHERE admin_id = @admin_id;

    -- Delete from Master
    DELETE FROM Master
    WHERE user_id = @admin_id;
END;
GO


-- Add new admin
EXEC sp_AddAdmin 'A101', 'John Doe', 'john@example.com', 'securePass123', 'admin';

-- Update admin
EXEC sp_UpdateAdmin 'A101', 'John D', 'john.d@example.com', 'newPass456', 'admin';

-- Delete admin
EXEC sp_DeleteAdmin 'A101';






CREATE TABLE Admins (
    admin_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_no VARCHAR(15), 
    age INT,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at DATETIME DEFAULT GETDATE()
);



select * from Admins;

drop table Admins;

CREATE TABLE Instructors (
    instructor_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    phone VARCHAR(20),
    assigned_by_admin VARCHAR(20),
    assigned_at DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (assigned_by_admin) REFERENCES Admins(admin_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
drop table Instructors;

/*CREATE TABLE Students (
    student_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    course VARCHAR(100),  -- Consider turning this into a foreign key if needed
    age INT,
    phone VARCHAR(20),
    assigned_by_admin VARCHAR(20),
    assigned_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (assigned_by_admin) REFERENCES Admins(admin_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE

);*/


DROP TABLE Students;

CREATE TABLE Students (
    student_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    course VARCHAR(10),  -- Now properly sized to match Courses.course_id
    age INT,
    phone VARCHAR(20),
    assigned_by_admin VARCHAR(20) NULL,  -- Must be nullable for ON DELETE SET NULL
    assigned_at DATETIME DEFAULT GETDATE(),  -- Use CURRENT_TIMESTAMP if not on SQL Server


    -- Foreign key to Admins
    FOREIGN KEY (assigned_by_admin) REFERENCES Admins(admin_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


CREATE TABLE InstructorCourseAssignments (
    assignment_id INT PRIMARY KEY IDENTITY(1,1),
    instructor_id VARCHAR(20) NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    assigned_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        ON DELETE NO ACTION  -- Changed here
        ON UPDATE CASCADE,

    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
        ON DELETE CASCADE  -- Keep cascade here for cleanup on course delete
        ON UPDATE CASCADE
);

CREATE TABLE StudentCourseAssignments (
    assignment_id INT PRIMARY KEY IDENTITY(1,1),
    student_id VARCHAR(20) NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    enrolled_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (student_id) REFERENCES Students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
        ON DELETE CASCADE  -- Keep cascade here for cleanup on course delete
        ON UPDATE CASCADE
    
);








INSERT INTO Admins (admin_id, name, email, password)
VALUES 
('A001', 'Alice Johnson', 'alice@edu.com', 'password123'),
('A002', 'Bob Smith', 'bob@edu.com', 'securepass');


INSERT INTO Instructors (instructor_id, name, email, password, department, phone, assigned_by_admin)
VALUES 
('I001', 'John Doe', 'john.doe@edu.com', 'pass123', 'Computer Science', '1234567890', 'A001'),
('I002', 'Jane Lee', 'jane.lee@edu.com', 'pass456', 'Data Analytics', '9876543210', 'A002');

INSERT INTO Students (student_id, name, email, password, course, age, phone, assigned_by_admin)
VALUES 
('S001', 'Michael Brown', 'michael@edu.com', 'stud123', 'C001', 22, '5551234567', 'A001'),
('S002', 'Laura Green', 'laura@edu.com', 'stud456', 'C002', 25, '5557654321', 'A002');



INSERT INTO InstructorCourseAssignments (instructor_id, course_id)
VALUES 
('INS002', 'C001'),
('INS003', 'C002');


INSERT INTO StudentCourseAssignments (student_id, course_id)
VALUES 
('STU001', 'C001'),
('STU002', 'C002');


select * from InstructorCourseAssignments;
select * from StudentCourseAssignments;

SELECT * FROM Admins;
SELECT * FROM Instructors;
SELECT * FROM Students;
SELECT * FROM master;

COMMIT;


-- QUERY 5  -> ADMIN PART TO SEE WHICH COURSE, WHICHINSTRUCTOR AND WHICH STUDENT ASSIGNED

SELECT 
    c.course_id,
    c.subject AS course_name,
    i.instructor_id,
    i.name AS instructor_name,
    s.student_id,
    s.name AS student_name
FROM Courses c

-- Join instructors assigned to course
LEFT JOIN InstructorCourseAssignments ica ON c.course_id = ica.course_id
LEFT JOIN Instructors i ON ica.instructor_id = i.instructor_id

-- Join students assigned to course
LEFT JOIN StudentCourseAssignments sca ON c.course_id = sca.course_id
LEFT JOIN Students s ON sca.student_id = s.student_id

ORDER BY c.course_id, i.instructor_id, s.student_id;

-- QUERY 6  for instructor to see which course enrolled

SELECT 
    c.course_id,
    c.subject,
    c.duration,
    c.description,
    c.start_date,
    c.end_date,
    c.course_image,
    ica.instructor_id
FROM Courses c
INNER JOIN InstructorCourseAssignments ica
    ON c.course_id = ica.course_id
INNER JOIN Instructors i
    ON ica.instructor_id = i.instructor_id;



-- QUERY 7  for student to see which course enrolled


SELECT 
    c.course_id,
    c.subject,
    c.duration,
    c.description,
    c.start_date,
    c.end_date,
    c.course_image,
    sca.student_id
FROM Courses c
INNER JOIN StudentCourseAssignments sca
    ON c.course_id = sca.course_id
INNER JOIN Students s
    ON sca.student_id = s.student_id;



-- QUERY 17  for the instructo see which srudent enrolled under him

SELECT 
    s.name AS student_name,
    s.email,
    s.age,
    s.phone,
    c.course_id,
    c.subject AS course_name
FROM Students s
INNER JOIN StudentCourseAssignments sca
    ON s.student_id = sca.student_id
INNER JOIN Courses c
    ON sca.course_id = c.course_id
INNER JOIN InstructorCourseAssignments ica
    ON c.course_id = ica.course_id
WHERE ica.instructor_id = 'INS002';  -- replace with the instructor_id you want


-- QUERY 18  for the student to see which instructor enrolled under which course that he/she is enrolled 


SELECT 
    i.name AS instructor_name,
    i.email AS instructor_email,
    i.phone AS instructor_phone,
    c.course_id,
    c.subject AS course_name
FROM Students s
INNER JOIN StudentCourseAssignments sca
    ON s.student_id = sca.student_id
INNER JOIN Courses c
    ON sca.course_id = c.course_id
INNER JOIN InstructorCourseAssignments ica
    ON c.course_id = ica.course_id
INNER JOIN Instructors i
    ON ica.instructor_id = i.instructor_id
WHERE s.student_id = 'STU001';  -- replace with the student_id you want


-- QUERY 19   instructor can see: Which courses he/she teaches   And for those courses, which students are enrolled

SELECT 
    i.instructor_id,
    i.name AS instructor_name,
    c.course_id,
    c.subject,
    s.student_id,
    s.name AS student_name,
    --s.email AS student_email
FROM Instructors i
INNER JOIN InstructorCourseAssignments ica 
    ON i.instructor_id = ica.instructor_id
INNER JOIN Courses c 
    ON ica.course_id = c.course_id
LEFT JOIN StudentCourseAssignments sca 
    ON c.course_id = sca.course_id
LEFT JOIN Students s 
    ON sca.student_id = s.student_id
WHERE i.instructor_id = 'INS002';   -- put instructor id here




-- QUERY 20

-- QUERY 21











-- Assignments table
CREATE TABLE Assignments (
    assignment_id VARCHAR(20) PRIMARY KEY,
    topic_id VARCHAR(10) NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    instructor_id VARCHAR(20) NOT NULL,
    description TEXT,
    file_link VARCHAR(255),
    due_date DATE NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (course_id, topic_id) REFERENCES Topics(course_id, topic_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Assignment Submissions by students
CREATE TABLE AssignmentSubmissions (
    submission_id VARCHAR(20) PRIMARY KEY,
    assignment_id VARCHAR(20) NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    submitted_at DATETIME DEFAULT GETDATE(),
    file_link VARCHAR(255),
    grade VARCHAR(10),
    feedback TEXT,

    FOREIGN KEY (assignment_id) REFERENCES Assignments(assignment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE ,
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
        
);

DROP TABLE AssignmentSubmissions;




-- Tests table
CREATE TABLE Tests (
    test_id VARCHAR(20) PRIMARY KEY,
    topic_id VARCHAR(10) NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    instructor_id VARCHAR(20) NOT NULL,
    description TEXT Not null,
    total_marks INT NOT NULL,
    test_date DATE NOT NULL,
    duration_minutes INT,
    file_link VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (course_id, topic_id) REFERENCES Topics(course_id, topic_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);



-- Student Test Attempts
CREATE TABLE TestSubmissions (
    submission_id VARCHAR(20) PRIMARY KEY,
    test_id VARCHAR(20) NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    submitted_at DATETIME DEFAULT GETDATE(),
    obtained_marks INT,
    grade VARCHAR(10),
    feedback TEXT,

    FOREIGN KEY (test_id) REFERENCES Tests(test_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
       
);
DROP TABLE TestSubmissions;

SELECT * FROM Students;


INSERT INTO Assignments (assignment_id, topic_id, course_id, instructor_id, description, due_date)
VALUES
('ASS001', 'T001', 'C001', 'INS002', 'Draw ER diagram for a university database.', '2025-02-15'),
('ASS002', 'T002', 'C001', 'INS002', 'Write SQL queries for sample company DB.', '2025-03-01'),
('ASS003', 'T001', 'C002', 'INS003', 'Design a static webpage using HTML & CSS.', '2025-03-10');



INSERT INTO AssignmentSubmissions (submission_id,assignment_id, student_id, file_link, grade, feedback)
VALUES
('SUBASS001','ASS001', 'STU001', 'uploads/john_er.pdf', 'A', 'Excellent work!'),
('SUBASS002','ASS001', 'STU002', 'uploads/mary_er.pdf', 'B+', 'Good, but missing relationships.'),
('SUBASS003','ASS003', 'STU003', 'uploads/raj_html.zip', 'A-', 'Nice webpage design.');


INSERT INTO Tests (test_id, topic_id, course_id, instructor_id, description, total_marks, test_date, duration_minutes)
VALUES
('TST001', 'T002', 'C001', 'INS002', 'SQL Queries mid-term exam', 50, '2025-03-05', 90),
('TST002', 'T002', 'C002', 'INS002', 'JavaScript fundamentals test', 40, '2025-04-20', 60);


INSERT INTO TestSubmissions (submission_id, test_id, student_id, obtained_marks, grade, feedback)
VALUES
('SUBTST001', 'TST001', 'STU001', 45, 'A', 'Great SQL knowledge.'),
('SUBTST002', 'TST001', 'STU002', 32, 'B-', 'Needs improvement in joins.'),
('SUBTST003', 'TST002', 'STU003', 38, 'A', 'Good grasp of JS basics.');

SELECT * FROM Assignments;
SELECT * FROM AssignmentSubmissions;
SELECT * FROM Tests;
SELECT * FROM TestSubmissions;

-----------------------------------------------------NOT ADDED IN FINAL -------------------------------------

SELECT 
    a.assignment_id,
    a.topic_id,
    a.course_id,
    a.instructor_id,
    c.subject AS course_name,
    t.description AS topic_description,
    s.student_id,
    s.name AS student_name,
    a.due_date,
    GETDATE() AS current_datetime
FROM Assignments a
INNER JOIN Topics t
    ON a.course_id = t.course_id 
   AND a.topic_id = t.topic_id
INNER JOIN Courses c
    ON a.course_id = c.course_id
INNER JOIN Students s
    ON s.course = a.course_id
WHERE a.instructor_id = 'INS001';   -- filter for instructor




SELECT 
    c.subject AS course_name,
    t.description AS topic_description,
    s.student_id,
    s.name AS student_name,
    a.due_date,
    GETDATE() AS current_datetime
FROM Assignments a
INNER JOIN Topics t
    ON a.course_id = t.course_id 
   AND a.topic_id = t.topic_id
INNER JOIN Courses c
    ON a.course_id = c.course_id
INNER JOIN Students s
    ON s.course = a.course_id
WHERE a.instructor_id = 'INS002';   -- filter for instructor




-- View all tests created by a given instructor
SELECT 
    t.test_id,
    t.description AS test_description,
    t.total_marks,
    t.test_date,
    t.duration_minutes,
    t.created_at,
    c.course_id,
    c.subject AS course_name,
    tp.topic_id,
    tp.module_title AS topic_name,
    i.instructor_id,
    i.name AS instructor_name,
    i.email AS instructor_email
FROM Tests t
INNER JOIN Courses c 
    ON t.course_id = c.course_id
INNER JOIN Topics tp 
    ON t.course_id = tp.course_id 
   AND t.topic_id = tp.topic_id
INNER JOIN Instructors i 
    ON t.instructor_id = i.instructor_id
WHERE t.instructor_id = 'INS002';






-----------------------------------------------------NOT ADDED IN FINAL -------------------------------------



----------------------------------------------------------------------------------------------------------------------------------------------



-- STORAGE PROCEDURE

-- select * from Courses;

CREATE PROCEDURE GetAllCourses
AS
BEGIN
    SELECT * FROM Courses;
END;


EXECUTE GetAllCourses;


--SELECT * FROM Topics;

CREATE PROCEDURE GetAllTopics
AS
BEGIN
    SELECT * FROM Topics;
END;

EXEC GetAllTopics;

--SELECT * FROM SubTopics

CREATE PROCEDURE GetAllSubTopics
AS
BEGIN
    SELECT * FROM SubTopics;
END;

EXEC GetAllSubTopics;


-- Get all InstructorCourseAssignments
CREATE PROCEDURE sp_GetInstructorCourseAssignments
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM InstructorCourseAssignments;
END;
GO

-- Get all StudentCourseAssignments
CREATE PROCEDURE sp_GetStudentCourseAssignments
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM StudentCourseAssignments;
END;
GO

-- Get all Admins
CREATE PROCEDURE sp_GetAdmins
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Admins;
END;
GO

-- Get all Instructors
CREATE PROCEDURE sp_GetInstructors
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Instructors;
END;
GO

-- Get all Students
CREATE PROCEDURE sp_GetStudents
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Students;
END;
GO

-- Get all Master users
CREATE PROCEDURE sp_GetMaster
AS
BEGIN
    SET NOCOUNT ON;
    SELECT * FROM Master;
END;
GO

--SELECT * FROM Assignments;
CREATE PROCEDURE sp_ViewAssignments
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM Assignments;
END;

EXEC sp_ViewAssignments;

--SELECT * FROM AssignmentSubmissions;
CREATE PROCEDURE sp_ViewAssignmentSubmissions
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM AssignmentSubmissions;
END;

EXEC sp_ViewAssignmentSubmissions;

--SELECT * FROM Tests;
CREATE PROCEDURE sp_ViewTests
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM Tests;
END;

EXEC sp_ViewTests;

--SELECT * FROM TestSubmissions;

CREATE PROCEDURE sp_ViewTestSubmissions
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * FROM TestSubmissions;
END;

EXEC sp_ViewTestSubmissions;




-- QUERY 1

CREATE PROCEDURE GetCourseFullDetails
    @CourseID VARCHAR(10)
AS
BEGIN
    SELECT
        -- Course Details
        c.course_id,
        c.subject AS course_name,
        c.duration AS course_duration,
        c.description AS course_description,
        c.start_date,
        c.end_date,

        -- Topic Details
        t.topic_id,
        t.module_title AS topic_title,
        t.duration AS topic_duration,
        t.description AS topic_description,

        -- Subtopic Details
        st.subtopic_id,
        st.submodule_title AS subtopic_title,
        st.duration AS subtopic_duration,
        st.video_link,
        st.documentation AS subtopic_documentation,
        st.description AS subtopic_description

    FROM Courses c
    LEFT JOIN Topics t 
        ON c.course_id = t.course_id
    LEFT JOIN SubTopics st 
        ON t.course_id = st.course_id AND t.topic_id = st.topic_id

    WHERE c.course_id = @CourseID
    ORDER BY t.topic_id, st.subtopic_id;
END;


EXEC GetCourseFullDetails @CourseID = 'C001';



-- QUERY 2

CREATE PROCEDURE GetTopicAndSubTopicDetailsByCourse
    @CourseID VARCHAR(10)
AS
BEGIN
    SELECT
        t.topic_id,
        t.module_title,
        t.duration AS topic_duration,
        t.description AS topic_description,
        st.subtopic_id,
        st.submodule_title,
        st.duration AS subtopic_duration,
        st.description AS subtopic_description
    FROM Topics t
    LEFT JOIN SubTopics st 
        ON t.course_id = st.course_id AND t.topic_id = st.topic_id
    WHERE t.course_id = @CourseID
    ORDER BY t.topic_id, st.subtopic_id;
END;

EXEC GetTopicAndSubTopicDetailsByCourse @CourseID = 'C001';



-- QUERY 3

CREATE PROCEDURE GetSubTopicsByCourseAndTopic
    @CourseID VARCHAR(10),
    @TopicID VARCHAR(10)
AS
BEGIN
    SELECT 
        subtopic_id,
        submodule_title,
        duration,
        video_link,
        documentation,
        description
    FROM SubTopics
    WHERE course_id = @CourseID AND topic_id = @TopicID;
END;

EXEC GetSubTopicsByCourseAndTopic @CourseID = 'C001', @TopicID = 'T002';


-- QUERY 4

CREATE PROCEDURE GetSubTopicDetails
    @CourseID VARCHAR(10),
    @TopicID VARCHAR(10),
    @SubTopicID VARCHAR(10)
AS
BEGIN
    SELECT *
    FROM SubTopics
    WHERE course_id = @CourseID
      AND topic_id = @TopicID
      AND subtopic_id = @SubTopicID;
END;

EXEC GetSubTopicDetails 
    @CourseID = 'C001', 
    @TopicID = 'T001', 
    @SubTopicID = 'ST001';


--select * from InstructorCourseAssignments;

CREATE PROCEDURE GetAllInstructorCourseAssignments
AS
BEGIN
    SELECT * FROM InstructorCourseAssignments;
END;

EXEC GetAllInstructorCourseAssignments;



--select * from StudentCourseAssignments;

CREATE PROCEDURE GetAllStudentCourseAssignments
AS
BEGIN
    SELECT * FROM StudentCourseAssignments;
END;


EXEC GetAllStudentCourseAssignments;


--SELECT * FROM Admins;

CREATE PROCEDURE GetAllAdmins
AS
BEGIN
    SELECT * FROM Admins;
END;

EXEC GetAllAdmins;



--SELECT * FROM Instructors;

CREATE PROCEDURE GetAllInstructors
AS
BEGIN
    SELECT * FROM Instructors;
END;

EXEC GetAllInstructors;


-- SELECT * FROM Students;

CREATE PROCEDURE GetAllStudents
AS
BEGIN
    SELECT * FROM Students;
END;

EXEC GetAllStudents;




-- QUERY 5
-- QUERY 6
-- QUERY 7
-- QUERY 8

CREATE PROCEDURE GetCourseWithTopics
    @CourseID VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.course_id,
        c.subject AS course_name,
        t.description,
        t.topic_id,
        t.module_title,
        t.duration
    FROM Courses c
    JOIN Topics t ON c.course_id = t.course_id
    WHERE c.course_id = @CourseID;
END;

EXEC GetCourseWithTopics @CourseID = 'C001';


-- QUERY 9

CREATE PROCEDURE GetCourseTopicSubtopics
    @TopicID VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        -- Course details
        c.course_id,
        c.subject AS course_name,
        c.description AS course_description,
        c.duration AS course_duration,
        c.start_date,
        c.end_date,

        -- Topic info
        t.topic_id,
        t.module_title AS topic_title,
        t.description AS topic_description,
        t.duration AS topic_duration,

        -- Subtopic info
        s.subtopic_id,
        s.submodule_title,
        s.description AS subtopic_description,
        s.duration AS subtopic_duration,
        s.video_link,
        s.documentation

    FROM Topics t
    JOIN Courses c 
        ON t.course_id = c.course_id
    LEFT JOIN SubTopics s 
        ON t.course_id = s.course_id 
       AND t.topic_id = s.topic_id

    WHERE t.topic_id = @TopicID;
END;


EXEC GetCourseTopicSubtopics @TopicID = 'T001';


-- QUERY 10

CREATE PROCEDURE GetCourseTopicSubtopicNames
    @TopicID VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        -- Course details
        c.course_id,
        c.subject AS course_name,
        c.description AS course_description,
        c.duration AS course_duration,
        c.start_date,
        c.end_date,

        -- Topic details
        t.topic_id,
        t.module_title AS topic_title,
        t.description AS topic_description,
        t.duration AS topic_duration,

        -- Only Subtopic name
        s.subtopic_id,
        s.submodule_title AS subtopic_name

    FROM Topics t
    JOIN Courses c ON t.course_id = c.course_id
    LEFT JOIN SubTopics s 
        ON t.course_id = s.course_id 
       AND t.topic_id = s.topic_id

    WHERE t.topic_id = @TopicID;
END;

EXEC GetCourseTopicSubtopicNames @TopicID = 'T001';


-- QUERY 11

CREATE PROCEDURE GetCourseTopicSubtopicDetails
    @SubTopicID VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        -- Course details
        c.course_id,
        c.subject AS course_name,
        c.description AS course_description,
        c.duration AS course_duration,
        c.start_date,
        c.end_date,

        -- Topic details
        t.topic_id,
        t.module_title AS topic_title,
        t.description AS topic_description,
        t.duration AS topic_duration,

        -- SubTopic details
        s.subtopic_id,
        s.submodule_title,
        s.description AS subtopic_description,
        s.duration AS subtopic_duration,
        s.video_link,
        s.documentation

    FROM SubTopics s
    JOIN Topics t 
        ON s.course_id = t.course_id 
       AND s.topic_id = t.topic_id
    JOIN Courses c 
        ON s.course_id = c.course_id

    WHERE s.subtopic_id = @SubTopicID;
END;

EXEC GetCourseTopicSubtopicDetails @SubTopicID = 'ST001';
