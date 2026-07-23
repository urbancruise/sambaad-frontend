import {
createSlice,
PayloadAction
} from "@reduxjs/toolkit";

import {
TeamLeadDashboard
} from "../types";


interface State{

 dashboard:TeamLeadDashboard|null;

 loading:boolean;

 error:string|null;

}


const initialState:State={

 dashboard:null,

 loading:false,

 error:null

};



const slice=createSlice({

name:"teamLeadDashboard",

initialState,

reducers:{


start(state){

state.loading=true;

},


success(
state,
action:PayloadAction<TeamLeadDashboard>
){

state.loading=false;

state.dashboard=action.payload;

},


failure(
state,
action:PayloadAction<string>
){

state.loading=false;

state.error=action.payload;

}


}


});


export const {
start,
success,
failure

}=slice.actions;


export default slice.reducer;