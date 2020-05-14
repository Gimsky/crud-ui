import React, { Component } from 'react'
import axios from 'axios'

export default class Table extends Component {

    state = {
        data: this.props.data,
        isLoaded: false,
        isEditing: false,
        editingId: 0,
        newMail: "",
        newAge: "",
        changedItem: {}

    }

    componentDidMount() {
        fetch("http://178.128.196.163:3000/api/records")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        data: result
                    });
                }
            )
    }


    constructor(props) {
        super(props);
        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
        this.getKeys = this.getKeys.bind(this);
    }


    getKeys = function () {
        return ['Email', 'Age']//Object.keys(this.state.data[0]);
    }

    getHeader = function () {
        var keys = this.getKeys();
        return keys.map((key, index) => {
            return <th key={key}>{key.toUpperCase()}</th>
        })
    }

    getRowsData = function () {
        var keys = ['Email', 'Age'];
        return this.state.data.map((row, index) => {
            return <tr key={row._id}>
                {/* <RenderRow key={row._id} data={row.data} keys={keys} isEditing={this.state.isEditing}  /> */}

                {keys.map((key, index) => {
                    return <td key={row.data[key]}>
                        {this.state.isEditing && this.state.editingId == row._id ?
                            <input defaultValue={row.data[key]} onChange={(e) => this.handleInputChange(row._id, key, e)} ></input> :
                            <span>{row.data[key]}</span>}
                    </td>
                })}

                {this.state.isEditing && this.state.editingId == row._id ? <td> <button className="btn btn-edit" onClick={(e) => this.handleSaveRow(row._id, e)}> Save </button> </td> :
                    <td> <button className="btn btn-edit" onClick={(e) => this.handleEditRow(row._id, e)}> Edit </button> </td>}

                <td> <button className="btn btn-remove" onClick={(e) => this.handleRemoveRow(row._id)}> Remove  </button> </td>
            </tr>
        });

    }




    elemRowAdd = function () {
        return <table>
            <tbody>
                <tr>
                    <td>
                        <input placeholder="Email" name="Email" onChange={this.handleInputAddChange} ></input>
                    </td>
                    <td>
                        <input placeholder="Age" name="Age" onChange={this.handleInputAddChange}></input>
                    </td>
                    <td>
                        <button className="btn btn-add" onClick={this.handleAddRow}> Add Row </button>
                    </td>
                </tr>
            </tbody>
        </table>
    }

    handleInputAddChange = (e) => {
        let email = e.target.name === "Email" ? e.target.value : this.state.newMail
        let age = e.target.name === "Age" ? e.target.value : this.state.newAge

        this.setState({
            newMail: email,
            newAge: age
        })
    }

    handleAddRow = (e) => {
        let data = {
            'Email': this.state.newMail,
            'Age': this.state.newAge
        }


        axios.put('http://178.128.196.163:3000/api/records', {
            data
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        // this.setState({
        //     data: [...this.state.data, data]
        // });

        this.setState({
            newMail: "",
            newAge: ""
        })

    };

    handleRemoveRow = (id) => {
        axios.delete('http://178.128.196.163:3000/api/records/' + id)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });

        let data = this.state.data
        let newData;
        newData = data.filter((el) => {
            return el._id !== id
        })

        this.setState({
            data: newData
        })
    }

    handleEditRow = (id) => {
        let data = this.state.data
        let editibleItem = data.find(item => item._id === id)
        let changedElem = new Object();

        changedElem.id = id
        changedElem.email = editibleItem.data["Email"]
        changedElem.age = editibleItem.data["Age"]

        this.setState({
            isEditing: true,
            editingId: id,
            changedItem: changedElem
        })
    }

    handleInputChange = (id, name, e) => {
        let value = e.target.value
        let data = this.state.data
        let editibleItem = data.find(item => item._id === id)
        let changedElem = new Object();
        changedElem.id = id
        switch (name) {
            case 'Email':
                changedElem.email = value
                changedElem.age = this.state.changedItem.age || editibleItem.data["Age"]
                break;

            case 'Age':
                changedElem.email = this.state.changedItem.email || editibleItem.data["Email"]
                changedElem.age = value
                break;
        }

        this.setState({
            changedItem: changedElem
        })
    }

    handleSaveRow = (id, e) => {
        let data = {
            'Email': this.state.changedItem.email,
            'Age': this.state.changedItem.age
        }

        if (this.state.changedItem != {}) {
            axios.post('http://178.128.196.163:3000/api/records/' + id, {
                data
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }



        this.setState({
            isEditing: false,
            changedItem: {}
        })
    }

    render() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>{this.getHeader()}</tr>
                    </thead>
                    <tbody>
                        {this.getRowsData()}

                    </tbody>
                </table>
                {this.elemRowAdd()}
            </div>

        );
    }
}

// const RenderRow = (props) => {
//     return props.keys.map((key, index) => {
//         return <td key={props.data[key]}>  {props.isEditing ? <input value={props.data[key]} ></input> : <span>{props.data[key]}</span>}
//         </td>
//     })
// }