        {tab==="manual"  &&<TabManual   setEnvios={setEnvios} onSuccess={()=>{setTab("envios");mostrarToast("Envio agregado");}} logisticasConfig={logisticasConfig} enviosExistentes={envios}/>}
        {tab==="tarifas" &&<TabTarifas  zonasConfig={zonasConfig} setZonasConfig={setZonasConfig} logisticasConfig={logisticasConfig} setLogisticasConfig={setLogisticasConfig}/>}
        {tab==="informe" &&<TabInforme  envios={envios} zonasConfig={zonasConfig} logisticasConfig={logisticasConfig}/>}
      </div>
    </div>
  );
}
