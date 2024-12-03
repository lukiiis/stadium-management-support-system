import React from "react";
import { ErrorToast } from "react-native-toast-message";
import { BaseToast } from "react-native-toast-message/lib/src/components/BaseToast";
import { BaseToastProps } from "react-native-toast-message/lib/src/types";

const toastConfig = {
    success: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#22c55e',
                marginBottom: 30
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{ fontSize: 15, fontWeight: 'bold' }}
            text2Style={{ fontSize: 13 }}
        />
    ),
    error: (props: React.JSX.IntrinsicAttributes & BaseToastProps) => (
        <ErrorToast
            {...props}
            style={{
                borderLeftColor: '#ef4444',
                marginTop: 30
            }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{ fontSize: 15, fontWeight: 'bold' }}
            text2Style={{ fontSize: 13 }}
        />
    )
};

export default toastConfig;