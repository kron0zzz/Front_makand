import { useState,useCallback } from "react";
import { useAlertModal } from "../../../shared/alertModal";

import {
    getWorkspace,

    createReturn,
    updateReturn,
    deleteReturn,

    getCutsByOrder,
    createCut,

    getPaymentsByOrder,
    createPayment,
    closeOrder

} from "../services/workspaceService";

import { orderService } from "../services/orderService";

export const useWorkspace = () => {
  const { showConfirm } = useAlertModal();

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


    const cerrarPedido = async (orderId) => {

            if (!await showConfirm(
        `¿Está seguro de cerrar este pedido?

        Esta acción no se puede deshacer.

        • El pedido quedará finalizado.
        • No será posible registrar devoluciones.
        • No será posible registrar cortes.
        • No será posible registrar pagos.

        ¿Desea continuar?`
            )) return;

            try {

                await closeOrder(orderId);
                await cargarWorkspace(orderId);

                return {
                    success: true,
                    message: "Pedido cerrado correctamente."
                };

            } catch (error) {

                return {
                    success: false,
                    message:
                        error.response?.data?.message ||
                        "No fue posible cerrar el pedido."
                };

            }

        };


    const anularPedido = async (orderId) => {
        if (!await showConfirm(
          `¿Está seguro de que desea anular este pedido?

          Esta acción no se puede deshacer.

          • Toda la maquinaria será devuelta automáticamente al inventario.
          • El pedido quedará bloqueado y no podrá modificarse.
          • No será posible registrar devoluciones, cortes ni pagos.

          ¿Desea continuar?`
        )) return;
        try {
          await orderService.anular(orderId);
          await cargarWorkspace(orderId);
          return {
            success: true,
            message: "Pedido anulado correctamente."
          };
        } catch (error) {
          return {
            success: false,
            message:
              error.response?.data?.error ||
              error.response?.data?.message ||
              "Error al anular el pedido."
          };
        }
      };



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

         if (!await showConfirm(
             `¿Está seguro de eliminar esta devolución?

Esta acción no se puede deshacer.

¿Desea continuar?`
         )) return;

         try {

             await deleteReturn(returnId);
             await cargarWorkspace(orderId);

             return {
                 success: true,
                 message: "Devolución eliminada correctamente."
             };

         } catch (error) {

             return {
                 success: false,
                 message:
                     error.response?.data?.message ||
                     "No fue posible eliminar la devolución."
             };

         }

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
        await refreshWorkspaceSilent(orderId);
    };



    return{

        workspace,
        loading,
        error,
        cargarWorkspace,
        cerrarPedido,
        anularPedido,

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