import { Badge } from "@radix-ui/themes";
import Role from "../../types/Role";
import rolesList from "../../types/Roles";

export default function RolesBadge({ roles }: { roles: Role[] }) {
  return (
    <>
      {roles.map((e, index) => {
        return (
          <Badge key={index} color={rolesList[e.name].color}>
            {rolesList[e.name].text}
          </Badge>
        );
      })}
    </>
  );
}
