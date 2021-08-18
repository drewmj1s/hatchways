import '../App.css'
import Student from "../DataDisplay/Student";
import React from "react";

class StudentData extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            error: null,
            loaded: false,
            studentAggregateData: [],
            studentIdentifiers: [],
        }
        this.search = this.search.bind(this);
        this.toggleStudentVisibility = this.toggleStudentVisibility.bind(this);
        this.addTagToStudent = this.addTagToStudent.bind(this);
        this.setAllStudentsVisible = this.setAllStudentsVisible.bind(this);
    }


    componentDidMount(){
        //Fetches data from the given url
        fetch('https://api.hatchways.io/assessment/students')
            .then(res => {
                if(!res.ok) {
                    throw new Error("Could not fetch data");
                }
                return res.json();//response type
            })
            .then(
                (result) => {
                    //create an array of objects which contain the student component and it's visibility
                    //set visibility to true by default
                    let data = result.students.map((student) => {
                        return {
                            studentComponent: <Student
                                city = {student.city}
                                company = {student.company}
                                email = {student.email}
                                firstName = {student.firstName}
                                lastName = {student.lastName}
                                grades = {student.grades}
                                pic = {student.pic}
                                skill = {student.skill}
                                id = {student.id}
                                key = {student.id}
                            />,
                            visibility: true,
                            tags: []
                        }
                    });
                    this.setState({loaded: true, studentAggregateData: data});
                },
                (error) => {
                    this.setState({loaded: true, error: error});
                });
    }

    /**
     * Search all students which have matching criteria of the input fields
     * @param filterMethod : string which indicates the method of sorting
     * @returns {{studentName: string, key: *, tags: *}[]}
     */
    search(filterMethod){
        let studentIdentifiers = this.studentsToSearch();
        const nameQuery = document.getElementById("search-by-name")?.value?.toLowerCase();
        const tagQuery = document.getElementById("search-by-tag")?.value?.toLowerCase();
        let namesOutput;
        switch (filterMethod) {
            //search by student name
            case "names":
                namesOutput = this.filterByName(studentIdentifiers, nameQuery)
                // if tag query field is not empty, filter tags by the currently visible student components; namesOutput
                if(tagQuery.length!==0){
                    this.filterByTag(namesOutput, tagQuery);
                }
                return namesOutput;
            // search by tags per student
            case "tags":
                //filter by names first
                namesOutput = nameQuery.length!==0 ? this.search("names") : studentIdentifiers;
                //then filter components by tags given the previous filter
                this.filterByTag(namesOutput, tagQuery);
                break;
            //may never trigger
            default:
                throw new Error('Unknown filter method');
        }
        if(nameQuery.length === 0 && tagQuery.length === 0){
            this.setAllStudentsVisible();
        }
    }

    /**
     * sets visibility of students who match part of the query based on name
     * @param studentIdentifiers : {{studentName: string, key: *, tags: *}[]}
     * @param query : string
     * @returns {*}
     */
    filterByName(studentIdentifiers, query){
        const filteredStudents = studentIdentifiers.filter(student => {
            const validStudent = student.studentName.includes(query);
            this.toggleStudentVisibility(student.key, validStudent);
            return validStudent ? student : false;
        })
        return filteredStudents;
    }

    /**
     * sets visibility of students who match part of the query based on tag
     * @param studentIdentifiers : {{studentName: string, key: *, tags: *}[]}
     * @param query : string
     * @returns {{studentName: string, key: *, tags: *}[]}
     */
    filterByTag(studentIdentifiers, query){
        let filteredStudents;
        if(query.length!==0 && studentIdentifiers?.length !== 0){
            filteredStudents = studentIdentifiers.filter(student => {
                let validTags = student.tags.filter((tag) =>{
                    // if tag has part of the query text, return it
                    return tag.includes(query) ? tag : null;
                })
                // set visibility of student component based on whether the above statement returned array of length > 0
                this.toggleStudentVisibility(student.key, validTags.length > 0);
                return student;
            });
        }
        else{
            filteredStudents = this.studentsToSearch()
        }
        return filteredStudents;
    }



    /**
     * uses the current aggregate data to return an array of objects with the name, tags and key of all students
     * this is the max search criteria needed at the moment but could be expanded with more elements in the array
     * @returns {{studentName: string, key: *, tags: *}[]}
     */
    studentsToSearch() {
        return this.state.studentAggregateData.map(student => {
            let sC = student.studentComponent;
            return {
                studentName: (sC.props.firstName + " " + sC.props.lastName).toLowerCase(),
                key: sC.key,
                tags: student.tags
            }
        })
    }

    /**
     * sets `studentKey` visibility to `visibile`
     * @param studentKey :  natural number
     * @param visible : boolean
     */
    toggleStudentVisibility(studentKey, visible){
        let saData = this.state.studentAggregateData;
        saData[studentKey-1].visibility = visible;
        this.setState({studentAggregateData: saData})
    }

    /**
     * sets all student components to be visible, should only trigger if both text fields are empty
     */
    setAllStudentsVisible(){
        this.state.studentAggregateData.map(student => {
            this.toggleStudentVisibility(student.studentComponent.key, true);
            return student;
        })
    }

    /**
     * given a student's key, add a tag to it; the tag is the `event`'s value
     * @param studentKey : natural number
     * @param event
     */
    addTagToStudent(studentKey, event){
        let saData = this.state.studentAggregateData;
        let tag = event.target.value.toLowerCase();
        //having the same tag twice in this system would be pointless
        if(!(saData[studentKey-1].tags.includes(tag))){
            saData[studentKey-1].tags.push(tag);
            event.target.value = '';
            this.setState({studentAggregateData: saData})
        }
        else{
            // in a real system, there would be a better system of telling the user this than alerting
            alert("Tag is already associated with this student")
        }
    }


    render(){
        return (
            <div id={"student-search-content"}>
                <div className={"filters"}>
                    <input
                        id={"search-by-name"}
                        type={"text"}
                        placeholder={"Search by name"}
                        onChange={() => this.search("names")}/>
                    <input
                        id={"search-by-tag"}
                        type={"text"}
                        placeholder={"Search by tag"}
                        onChange={() => this.search("tags")}/>
                </div>
                <div id={"student-data"}>
                {this.state.error != null
                    ?
                    <div className={"Error"}> Error: {this.state.error}</div>
                    :
                    (!this.state.loaded
                        ?
                        <div className={"Loading"}>Loading...</div>
                        :
                        this.state.studentAggregateData.map(student => {
                                return (student.visibility) ?
                                <div className={"student-component-and-tags"}
                                     key={"container"+student.studentComponent.key}
                                     style={{width: '100%', backgroundColor:'white'}}>
                                    {student.studentComponent}
                                    <div className={"tag-area"}>
                                        <div className={"tag-collection"}>
                                            {student.tags.map(tag => {return <div className={"tag"}>{tag}</div>})}
                                        </div>
                                        <input
                                            id={student.studentComponent.key + "-tag-input"}
                                            type={"text"}
                                            className={"tag-input"}
                                            placeholder={"Add a tag"}
                                            onKeyPress={(e) =>
                                                e.key === 'Enter'
                                                    ?
                                                    this.addTagToStudent(student.studentComponent.key, e)
                                                    :
                                                    null}
                                            />
                                    </div>
                                    <hr className={"hr-student-data"}/>
                                </div>
                                :
                                null
                        }))
                }
                </div>
            </div>
        );
    }
}

export default StudentData;
