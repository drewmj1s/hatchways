import '../App.css';
import {useState} from "react";

/**
 * returns average of param `grades`
 * @param grades : array
 * @returns {number}
 */
const getAverage = (grades) => {
    let totalOfGrades = 0.0;
    let numOfGrades = 0.0;
    grades.forEach(grade => {
        totalOfGrades += parseInt(grade);
        numOfGrades++;
    })
    return totalOfGrades / numOfGrades;
}

function Student(props) {
    const name = (props.firstName + " " + props.lastName).toUpperCase();
    const average = getAverage(props.grades);
    const [expanded, setExpanded] = useState(false);

    function toggleExpanded(){
        setExpanded(!expanded)
    }

    return (
        <div className={"student"} key={props.id}>
            <img className={"pictures"} src={props.pic} alt={name}/>
            <div className={"text-info-area"}>
                <div className={"name-and-expand-area"}>
                    <h1 style={{fontSize: '40px', margin: '0px'}}> {name} </h1>
                    <button id={props.id+"-expnd"} className={"expand-btn"} onClick={toggleExpanded}> {expanded ? '‒' : '+'} </button>
                </div>
                <div className={"props-and-grades"}>
                    <p>Email: {props.email}</p>
                    <p>Company: {props.company}</p>
                    <p>Skill: {props.skill}</p>
                    <p id={props.id+"-avg"}>Average: {average}%</p>
                    {expanded ?
                        props.grades.map((grade,i) =>{
                            return <p key={props.id +"-grade-"+grade} id={props.id +"-grade-"+grade}>Test {i} : {grade}%</p>
                        })
                    : null}
                </div>
            </div>
        </div>
    );
}
export default Student;
