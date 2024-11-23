import React, { useState } from "react";
import { useBlockUser, useUnblockUser, useGetPaginatedUsers, UserData, BlockUnblockErrorResponse, BlockUnblockResponse } from "./blockUnblockAccountService";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress, Snackbar, Alert } from "@mui/material";
import styles from './BlockAccount.module.scss';
import { AxiosError } from "axios";

const BlockAccount: React.FC = () => {
    const [page, setPage] = useState(0);
    const [pageSize/*, setPageSize*/] = useState(2);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const users = useGetPaginatedUsers(page, pageSize);

    const blockUserMutation = useBlockUser();
    const unblockUserMutation = useUnblockUser();

    const handleBlock = (userId: number) => {
        blockUserMutation.mutate(userId, {
            onSuccess: (data: BlockUnblockResponse) => {
                console.log(`Successfully Blocked user`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                users.refetch();
            },
            onError: (error: AxiosError<BlockUnblockErrorResponse>) => {
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
            onSuccess: (data: BlockUnblockResponse) => {
                console.log(`Successfully unBlocked user`);
                setSuccessMessage(data.message);
                setShowSuccess(true);
                users.refetch();
            },
            onError: (error: AxiosError<BlockUnblockErrorResponse>) => {
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

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.data?.items?.map((user: UserData) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.age}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    {user.enabled ? (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleBlock(user.userId)}
                                        >
                                            Block
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleUnblock(user.userId)}
                                        >
                                            Unblock
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
