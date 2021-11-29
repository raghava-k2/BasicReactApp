import React from 'react'
import { getUser } from "../../hooks/useFindUser"
import useNavBar from "../../hooks/useNavBar";
import { AwsCloud, AzureCloud, GcpCloud } from "../user/settings/cloudConnections/CloudConnections";
import { ToasterContext } from "../common/Context";
import { useEffect, useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Dialog } from 'primereact/dialog';
import Api from "../../settings.json"

export const ConnectionInfo = ({ setCredentials, setConnectionPopup, showCloudConnectionPopup }) => {
    const [navBar] = useNavBar();
    const user = getUser()
    const { addMessage } = useContext(ToasterContext);
    let formGroupData = null;
    const cloudConnection = {};

    const setCloudConnectionData = (accessKey, secretKey, accountCode, clientId, clientSecret, subscriptionId, tenantId, fileContent) => {
        if (accessKey) {
            setCredentials({ "accessKey": accessKey, "secretKey": secretKey, "accountCode": accountCode })
        }
        else if (clientId) {
            setCredentials({
                "clientId": clientId, "clientSecret": clientSecret,
                "subscriptionId": subscriptionId, "tenantId": tenantId
            })
        }
        else {
            setCredentials(fileContent)

        }
    }

    const getCloudConnectionInfo = () => {
        const { cloudId } = navBar;
        const { userId } = user;
        axios
            .get(Api.ip + `cloudConnection/${userId}/${cloudId}`)
            .then((response) => {
                const { accessKey, secretKey, accountCode, clientId, clientSecret, subscriptionId, tenantId, gcpFile } = response.data
                
                setCloudConnectionData(accessKey, secretKey, accountCode, clientId, clientSecret, subscriptionId, tenantId, gcpFile)

            }).catch((err) => {
                
            });
    }


    useEffect(() => {

        getCloudConnectionInfo()
    }, [])

    const formGroup = (fromGroup) => {
        formGroupData = fromGroup;
    }

    const saveCloudProviderDetails = () => {
        const { cloudId } = navBar;
        const { form, validate } = formGroupData;
        const validation = validate();
        if (validation) {
            const { field, message } = validation;
            addMessage({ severity: 'error', summary: field, detail: message, sticky: true });
        } else {
            
            
            if (cloudId!==3){
                const { accessKey, secretKey, accountCode, clientId, clientSecret, subscriptionId, tenantId} = form;
                setCloudConnectionData(accessKey, secretKey, accountCode, clientId, clientSecret, subscriptionId, tenantId,undefined);
                setConnectionPopup(false);
            }else{
                const { accessKey, secretKey, accountCode, clientId, clientSecret, subscriptionId, tenantId, files: [file] } = form;
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const fileContent = fileReader.result;
                
                setCloudConnectionData(accessKey, secretKey, accountCode, clientId, clientSecret, subscriptionId, tenantId, fileContent);
                setConnectionPopup(false);
            };
            fileReader.readAsText(file);
        }
        }
    }


    const Footer = () => {
        return (
            <div>
                <Button style={{ marginRight: "16px" }} onClick={() => setConnectionPopup(false)}
                    className="Primary">Cancel</Button>
                <Button onClick={saveCloudProviderDetails}
                    className="Primary">Ok</Button>
            </div>
        );
    }

    return (
        <div>
            <Dialog header="Cloud Connection" visible={showCloudConnectionPopup} maximizable modal
                style={{ width: '30vw' }}
                footer={Footer}
                onHide={() => setConnectionPopup(false)}>
                <div className="p-fluid p-formgrid p-grid cac-form">
                    {(navBar?.cloudId === 1) &&
                        <AwsCloud formGroup={formGroup} cloudConnection={cloudConnection}></AwsCloud>
                    }
                    {
                        (navBar?.cloudId === 2) &&
                        <AzureCloud formGroup={formGroup} cloudConnection={cloudConnection}></AzureCloud>
                    }
                    {
                        (navBar?.cloudId === 3) &&
                        <GcpCloud formGroup={formGroup} cloudConnection={cloudConnection}></GcpCloud>
                    }
                </div>
            </Dialog>
        </div>
    )
}
