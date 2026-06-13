package com.encuentrodetalentos.app;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.Gravity;
import android.view.View;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    private static final String BASE_URL = "https://encuentrodetalentos.com";
    private static final int MEDIA_PERMISSION_REQUEST = 20;
    private static final int FILE_CHOOSER_REQUEST = 30;

    private WebView webView;
    private ImageView splashImage;
    private PermissionRequest pendingPermissionRequest;
    private ValueCallback<Uri[]> fileUploadCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.rgb(17, 17, 17));

        FrameLayout webShell = new FrameLayout(this);
        webView = new WebView(this);
        splashImage = new ImageView(this);
        splashImage.setImageResource(getResources().getIdentifier(
                "et_portada",
                "drawable",
                getPackageName()
        ));
        splashImage.setScaleType(ImageView.ScaleType.CENTER_CROP);
        splashImage.setBackgroundColor(Color.rgb(17, 17, 17));

        webShell.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));
        webShell.addView(splashImage, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));

        root.addView(webShell, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                0,
                1f
        ));

        LinearLayout nav = new LinearLayout(this);
        nav.setOrientation(LinearLayout.HORIZONTAL);
        nav.setGravity(Gravity.CENTER);
        nav.setPadding(6, 6, 6, 6);
        nav.setBackgroundColor(Color.rgb(17, 17, 17));
        root.addView(nav, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));

        addNavButton(nav, "Salón", "/salon-de-la-fama");
        addNavButton(nav, "Profile", "/camerino");
        addNavButton(nav, "Concursos", "/concursos");
        addNavButton(nav, "Escenario", "/escenario");
        addNavButton(nav, "Rankings", "/salon-de-la-fama#rankings");

        setContentView(root);
        configureWebView();
        handleIntent(getIntent(), true);
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUserAgentString(
                settings.getUserAgentString() + " EncuentroTalentosAndroid/1.0"
        );

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith(BASE_URL)) {
                    view.loadUrl(url);
                    return true;
                }

                if (url.startsWith("encuentrodetalentos://")) {
                    handleIntent(new Intent(Intent.ACTION_VIEW, Uri.parse(url)), false);
                    return true;
                }

                if (url.startsWith("https://") || url.startsWith("http://")) {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    return true;
                }

                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                if (splashImage != null && splashImage.getVisibility() == View.VISIBLE) {
                    splashImage.animate()
                            .alpha(0f)
                            .setDuration(420)
                            .withEndAction(() -> splashImage.setVisibility(View.GONE))
                            .start();
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                pendingPermissionRequest = request;
                requestMediaPermissions();
            }

            @Override
            public boolean onShowFileChooser(
                    WebView webView,
                    ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams
            ) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }

                fileUploadCallback = filePathCallback;

                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{
                        "image/*",
                        "video/*",
                        "audio/*"
                });

                startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                return true;
            }
        });
    }

    private void handleIntent(Intent intent, boolean isInitialLoad) {
        Uri data = intent != null ? intent.getData() : null;

        if (data != null && "encuentrodetalentos".equals(data.getScheme())) {
            String query = data.getEncodedQuery();
            String target = BASE_URL + "/camerino" + (query != null ? "?" + query : "");
            webView.loadUrl(target);
            return;
        }

        if (isInitialLoad) {
            webView.loadUrl(BASE_URL + "/?app=1");
        }
    }

    private void addNavButton(LinearLayout nav, String label, String path) {
        Button button = new Button(this);
        button.setText(label);
        button.setAllCaps(false);
        button.setTextSize(11);
        button.setTextColor("Concursos".equals(label) ? Color.rgb(255, 215, 0) : Color.WHITE);
        button.setBackgroundColor(Color.TRANSPARENT);
        button.setMinHeight(64);
        button.setPadding(2, 2, 2, 2);
        button.setOnClickListener(view -> webView.loadUrl(BASE_URL + path));

        nav.addView(button, new LinearLayout.LayoutParams(
                0,
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1f
        ));
    }

    private void requestMediaPermissions() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            grantPendingPermissionRequest();
            return;
        }

        List<String> missingPermissions = new ArrayList<>();

        if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            missingPermissions.add(Manifest.permission.CAMERA);
        }

        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            missingPermissions.add(Manifest.permission.RECORD_AUDIO);
        }

        if (missingPermissions.isEmpty()) {
            grantPendingPermissionRequest();
        } else {
            requestPermissions(
                    missingPermissions.toArray(new String[0]),
                    MEDIA_PERMISSION_REQUEST
            );
        }
    }

    private void grantPendingPermissionRequest() {
        if (pendingPermissionRequest == null) {
            return;
        }

        pendingPermissionRequest.grant(pendingPermissionRequest.getResources());
        pendingPermissionRequest = null;
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String[] permissions,
            int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode != MEDIA_PERMISSION_REQUEST || pendingPermissionRequest == null) {
            return;
        }

        for (int result : grantResults) {
            if (result != PackageManager.PERMISSION_GRANTED) {
                pendingPermissionRequest.deny();
                pendingPermissionRequest = null;
                return;
            }
        }

        grantPendingPermissionRequest();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode != FILE_CHOOSER_REQUEST || fileUploadCallback == null) {
            return;
        }

        Uri[] result = null;

        if (resultCode == RESULT_OK && data != null) {
            Uri uri = data.getData();
            if (uri != null) {
                result = new Uri[]{uri};
                try {
                    getContentResolver().takePersistableUriPermission(
                            uri,
                            Intent.FLAG_GRANT_READ_URI_PERMISSION
                    );
                } catch (SecurityException ignored) {
                    // Some providers do not grant persistable permissions.
                }
            }
        }

        fileUploadCallback.onReceiveValue(result);
        fileUploadCallback = null;
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }

        super.onBackPressed();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent, false);
    }
}
