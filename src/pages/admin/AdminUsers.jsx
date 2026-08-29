import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "../../hooks/useCurrentUser.js";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import LoadingState from "../../components/ui/Spinner.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { getErrorMessage } from "../../utils/errors.js";
import { formatDate } from "../../lib/format.js";

const AdminUsers = () => {
  const { profile } = useCurrentUser();
  const [roleFilter, setRoleFilter] = useState("");

  const users = useQuery(
    api.auth.users.adminListUsers,
    roleFilter ? { role: roleFilter } : {}
  );

  const setUserActive = useMutation(api.auth.users.adminSetUserActive);
  const promoteToAdmin = useMutation(api.admin.permissions.promoteToAdmin);
  const demoteToCustomer = useMutation(api.admin.permissions.demoteToCustomer);

  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null); // { userId, kind }

  async function run(userId, fn, args) {
    setError("");
    setBusyId(userId);
    try {
      await fn(args);
      setConfirmAction(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500">
            Promote admins, deactivate accounts. Roles are stored server-side and never
            client-settable.
          </p>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All roles</option>
          <option value="admin">Admins</option>
          <option value="customer">Customers</option>
        </select>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
      )}

      {users === undefined && <LoadingState label="Loading users…" />}

      {users !== undefined && users.length === 0 && (
        <EmptyState icon="users" title="No users match this filter" />
      )}

      <div className="space-y-3">
        {users?.map((user) => {
          const isSelf = profile?._id === user._id;
          const busy = busyId === user._id;
          const confirming = confirmAction?.userId === user._id ? confirmAction.kind : null;

          return (
            <div key={user._id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">
                      {user.name}
                      {isSelf && <span className="ml-1.5 text-xs font-normal text-slate-400">(you)</span>}
                    </p>
                    <Badge tone={user.role === "admin" ? "violet" : "slate"} className="capitalize">
                      {user.role}
                    </Badge>
                    <Badge tone={user.active ? "green" : "red"}>
                      {user.active ? "Active" : "Deactivated"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                  {user.phone && <p className="text-sm text-slate-500">{user.phone}</p>}
                  <p className="mt-0.5 text-xs text-slate-400">
                    Joined {formatDate(user.createdAt)} ·{" "}
                    <span className="font-mono break-all">{user._id}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {user.role === "customer" ? (
                    confirming === "promote" ? (
                      <>
                        <Button
                          size="sm"
                          loading={busy}
                          onClick={() => run(user._id, promoteToAdmin, { userId: user._id })}
                        >
                          Confirm promote
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() => setConfirmAction(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={busy}
                        onClick={() => setConfirmAction({ userId: user._id, kind: "promote" })}
                      >
                        Promote to admin
                      </Button>
                    )
                  ) : (
                    !isSelf &&
                    (confirming === "demote" ? (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={busy}
                          onClick={() => run(user._id, demoteToCustomer, { userId: user._id })}
                        >
                          Confirm demote
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() => setConfirmAction(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={busy}
                        onClick={() => setConfirmAction({ userId: user._id, kind: "demote" })}
                      >
                        Demote to customer
                      </Button>
                    ))
                  )}

                  {user.active ? (
                    !isSelf &&
                    (confirming === "deactivate" ? (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={busy}
                          onClick={() => run(user._id, setUserActive, { userId: user._id, active: false })}
                        >
                          Confirm deactivate
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={busy}
                          onClick={() => setConfirmAction(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setConfirmAction({ userId: user._id, kind: "deactivate" })}
                      >
                        Deactivate
                      </Button>
                    ))
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={busy}
                      onClick={() => run(user._id, setUserActive, { userId: user._id, active: true })}
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsers;
