"use server";

import { createClient } from "@supabase/supabase-js";

// Create admin client with service role key for privileged operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function deleteUserAccount(userId: string) {
  try {
    // Delete user data from all tables first
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profile) {
      // Delete related data
      await supabaseAdmin
        .from("spending_entries")
        .delete()
        .eq("profile_id", profile.id);

      await supabaseAdmin
        .from("spending_summaries")
        .delete()
        .eq("profile_id", profile.id);

      await supabaseAdmin
        .from("savings_goals")
        .delete()
        .eq("profile_id", profile.id);

      // Delete profile
      await supabaseAdmin.from("profiles").delete().eq("id", profile.id);
    }

    // Delete the auth user using admin API
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Delete account error:", error);
    return { success: false, error: "Failed to delete account" };
  }
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  try {
    // Get user email for re-authentication
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !userData.user?.email) {
      return { success: false, error: "User not found" };
    }

    // Verify current password by attempting sign in
    const { createClient: createBrowserClient } =
      await import("@supabase/supabase-js");
    const tempClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error: signInError } = await tempClient.auth.signInWithPassword({
      email: userData.user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Update password using admin API
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Update password error:", error);
    return { success: false, error: "Failed to update password" };
  }
}
