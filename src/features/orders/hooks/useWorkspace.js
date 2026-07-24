import { useState,useCallback } from "react";

import {

    getWorkspace,

    createReturn,
    updateReturn,
    deleteReturn,

    getCutsByOrder,
    createCut,

    getPaymentsByOrder,
    createPayment

} from "../services/workspaceService";

export const useWorkspace = () => {

    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cuts, setCuts] = useState([]);
    const [paymentsData, setPaymentsData] = useState([]);


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
//  Helpers de refresh silencioso
//-------------------------
    const refreshWorkspaceSilent = async (orderId) => {
        try {
            const data = await getWorkspace(orderId);
            setWorkspace(data);
        } catch (err) {
            console.error("No se pudo refrescar workspace:", err);
            // No establecer error global ni lanzar: la creación ya existió
        }
    };

    const refreshCutsSilent = async (orderId) => {
        try {
            const data = await getCutsByOrder(orderId);
            setCuts(data);
        } catch (err) {
            console.error("No se pudo refrescar cortes:", err);
        }
    };

    const refreshPaymentsSilent = async (orderId) => {
        try {
            const data = await getPaymentsByOrder(orderId);
            setPaymentsData(data);
        } catch (err) {
            console.error("No se pudo refrescar pagos:", err);
        }
    };


//------------------------
//  Returns
//-------------------------

    const registrarDevolucion = async (orderId, data) => {
        await createReturn(data);
        await refreshWorkspaceSilent(orderId);
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



    const registrarCorte = async (orderId, data) => {
        await createCut(data);
        await refreshCutsSilent(orderId);
        await refreshPaymentsSilent(orderId);
    };


//--------------------
// Payments
//------------------------



    const cargarAbonos = useCallback(async (orderId) => {

        try{

            setLoading(true);
            setError(null);
            const data = await getPaymentsByOrder(orderId);
            setPaymentsData(data);

        }
        catch(err){
            console.error(err);
            setError(err.message);
        }
        finally{
            setLoading(false);
        }

    },[]);




    const registrarAbono = async (orderId, data) => {
        await createPayment(data);
        await refreshPaymentsSilent(orderId);
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
        registrarCorte,

        paymentsData,
        cargarAbonos,
        registrarAbono

    };

};