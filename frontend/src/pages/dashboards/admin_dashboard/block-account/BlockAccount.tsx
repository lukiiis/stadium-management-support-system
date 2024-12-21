import React, { useState } from "react";
import { useBlockUser, useUnblockUser, useGetPaginatedUsers, usePromoteToAdmin } from "./blockUnblockAccountService";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress, Snackbar, Alert, Box, Paper } from "@mui/material";
import styles from './BlockAccount.module.scss';
import { AxiosError } from "axios";
import { ApiErrorResponse, ApiSuccessResponse } from "../../../../shared/types/api/apiResponse";
import { UserDto } from "../../../../shared/types/models/user";
import { Navigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { motion } from "framer-motion";

const BlockAccount: React.FC = () => {
    const token = localStorage.getItem("token");

    if (token === null) {
        return <Navigate to="/" replace />;
    }

    const userId = parseInt(jwtDecode<JwtPayload>(token).sub as string, 10);

    const [page, setPage] = useState(0);
    const [pageSize/*, setPageSize*/] = useState(10);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const users = useGetPaginatedUsers(page, pageSize);

    const blockUserMutation = useBlockUser();
    const unblockUserMutation = useUnblockUser();
    const promoteToAdminMutation = usePromoteToAdmin();

    const handleBlock = (userId: number) => {
        blockUserMutation.mutate(userId, {
            onSuccess: (data: ApiSuccessResponse) => {
                console.log(`Successfully Blocked user`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                users.refetch();
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                console.error(`Error Blocked user`);
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
                else {
                    setErrorMessage(`Error Blocked user`);
                    setShowError(true);
                }
            },
        });
    };

    const handleUnblock = (userId: number) => {
        unblockUserMutation.mutate(userId, {
            onSuccess: (data: ApiSuccessResponse) => {
                console.log(`Successfully unBlocked user`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                users.refetch();
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                console.error(`Error unBlocked user`);
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
                else {
                    setErrorMessage(`Error unBlocked user`);
                    setShowError(true);
                }
            },
        });
    };

    const handlePromote = (userId: number) => {
        promoteToAdminMutation.mutate(userId, {
            onSuccess: (data: ApiSuccessResponse) => {
                console.log(`Successfully promoted user to admin`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                users.refetch();
            },
            onError: (error: AxiosError<ApiErrorResponse>) => {
                console.error(`Error promoting user to admin`);
                if (error.response?.data?.error) {
                    setErrorMessage(error.response.data.error);
                    setShowError(true);
                }
                else {
                    setErrorMessage(`Error promoting user to admin`);
                    setShowError(true);
                }
            },
        });
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        event?.preventDefault();
        setPage(newPage);
    };

    const handleCloseSnackbar = () => {
        setShowError(false);
        setErrorMessage(null);
        setShowSuccess(false);
        setSuccessMessage(null);
    };

    if (users.isLoading) {
        return <CircularProgress />;
    }

    if (users.isError) {
        return (
            <div>Error fetching users</div>
        );
    }

    return (
        <div className={styles.container}>
            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
                    {successMessage}
                </Alert>
            </Snackbar>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={styles.card}
            >
                <h1>
                    User Management
                </h1>

                <TableContainer component={Paper} className={styles.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow className={styles.headerRow}>
                                <TableCell>ID</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Age</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.data?.items?.map((user: UserDto) => (
                                <TableRow
                                    key={user.userId}
                                    className={styles.dataRow}
                                >
                                    <TableCell>{user.userId}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.age}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <span className={styles.roleChip}>
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {user.userId !== userId && (
                                            <Box className={styles.actionButtons}>
                                                <Button
                                                    variant="contained"
                                                    color={user.enabled ? "error" : "primary"}
                                                    onClick={() => user.enabled ? handleBlock(user.userId) : handleUnblock(user.userId)}
                                                    className={styles.actionButton}
                                                >
                                                    {user.enabled ? "Block" : "Unblock"}
                                                </Button>
                                                {user.role === "EMPLOYEE" && (
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => handlePromote(user.userId)}
                                                        className={styles.actionButton}
                                                    >
                                                        Promote
                                                    </Button>
                                                )}
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </motion.div>

            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={users.data?.totalCount || 0}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={handleChangePage}
            // onRowsPerPageChange={(event: React.ChangeEvent) => setPageSize(event.target.nodeValue)}
            />
        </div>
    );
};

export default BlockAccount;
