import { useState,useCallback } from "react";

import {

    getWorkspace,
    createReturn,
    updateReturn,
    deleteReturn,

    getCutsByOrder,
    createCut

} from "../services/workspaceService";

export const useWorkspace = () => {

    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cuts, setCuts] = useState([]);


//------------------------
//  Workspace
//-------------------------
    const cargarWorkspace = useCallback(async (orderId) => {

        try{

            setLoading(true);
            setError(null);
            setWorkspace(null);

            const data = await getWorkspace(orderId);

            setWorkspace(data);

            return data;
        }

        catch(err){
            console.error(err);
            setError(err.message);
            throw err;
        }

        finally{
            setLoading(false);
        }

    }, []);



//------------------------
//  Returns
//-------------------------


    const registrarDevolucion = async (orderId,data) => {
        await createReturn(data);
        await cargarWorkspace(orderId);
    };



    const editarDevolucion = async (orderId,returnId,data) => {

        await updateReturn(
            returnId,
            data
        );

        await cargarWorkspace(orderId);
    };



    const eliminarDevolucion = async (orderId,returnId) => {

        await deleteReturn(returnId);

        await cargarWorkspace(orderId);

    };




//------------------------
//  Cuts
//-------------------------

    const cargarCortes = useCallback(async (orderId) => {

        try{

            setLoading(true);
            setError(null);
            const data = await getCutsByOrder(orderId);
            setCuts(data);

        }
        catch(err){
            console.error(err);
            setError(err.message);
        }
        finally{
            setLoading(false);
        }

    },[]);



    const registrarCorte = async (orderId,data) => {
        await createCut(data);
        //await cargarWorkspace(orderId);
        await cargarCortes(orderId);
    };



    return{

        workspace,
        loading,
        error,
        cargarWorkspace,

        registrarDevolucion,
        editarDevolucion,
        eliminarDevolucion,

        cuts,
        cargarCortes,
        registrarCorte

    };

};