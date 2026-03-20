export interface LegalContent {
    title: string;
    lastUpdated: string;
    sections: {
        heading: string;
        content: string;
    }[];
}

export const termsContent = {
    zh: {
        title: "服务条款",
        lastUpdated: "2024年1月1日",
        sections: [
            {
                heading: "1. 服务说明",
                content: "MAQC.ca 是魁北克省专业的业主自卖房（FSBO）信息与工具平台。我们为卖家和买家提供房产交易相关的信息、工具和模板，但不参与实际交易、谈判或佣金分成。"
            },
            {
                heading: "2. 用户责任",
                content: "用户应确保提供的信息真实、准确、完整。用户对自己的账户安全负责，不得与他人共享账户。用户同意不会利用我们的服务进行任何非法或未经授权的活动。"
            },
            {
                heading: "3. 房源信息",
                content: "卖家在发布房源时，必须提供真实、准确的房产信息。我们保留审核、修改或删除不实、误导性或违规房源信息的权利。房源展示期限根据所选的订阅计划而定。"
            },
            {
                heading: "4. 费用与支付",
                content: "我们提供多种订阅计划，费用在购买时明确显示。所有费用均不退还。我们保留随时调整价格的权利，但已购买的订阅计划不受影响。"
            },
            {
                heading: "5. 免责声明",
                content: "MAQC 不是房地产经纪公司，不提供买卖建议，不参与谈判或交易。我们不对房源信息的准确性、交易结果或任何第三方行为负责。用户应自行判断并承担交易风险。"
            },
            {
                heading: "6. 知识产权",
                content: "平台上的所有内容，包括但不限于文本、图形、标志、软件和设计，均受知识产权法保护。用户不得未经授权复制、修改、分发或用于商业目的。"
            },
            {
                heading: "7. 隐私保护",
                content: "我们重视用户隐私，收集的信息仅用于提供和改进服务。具体信息处理方式请参阅我们的隐私政策。"
            },
            {
                heading: "8. 服务变更与终止",
                content: "我们保留随时修改或终止服务的权利。我们可能暂停或终止违反本条款的用户账户，恕不另行通知。"
            },
            {
                heading: "9. 法律适用",
                content: "本条款受加拿大魁北克省法律管辖。任何争议应提交至魁北克省法院解决。"
            },
            {
                heading: "10. 联系我们",
                content: "如有任何问题，请通过以下方式联系我们：\n电子邮件：info@maqc.ca"
            }
        ]
    },
    fr: {
        title: "Conditions d'utilisation",
        lastUpdated: "1er janvier 2024",
        sections: [
            {
                heading: "1. Description des services",
                content: "MAQC.ca est une plateforme d'information et d'outils FSBO (For Sale By Owner) destinée uniquement au Québec. Nous fournissons des informations, des outils et des modèles pour les transactions immobilières, mais nous ne participons pas aux transactions, aux négociations ou au partage de commissions."
            },
            {
                heading: "2. Responsabilités de l'utilisateur",
                content: "L'utilisateur doit fournir des informations véridiques, exactes et complètes. L'utilisateur est responsable de la sécurité de son compte et ne doit pas partager ses identifiants. L'utilisateur s'engage à ne pas utiliser nos services à des fins illégales ou non autorisées."
            },
            {
                heading: "3. Annonces immobilières",
                content: "Les vendeurs doivent fournir des informations immobilières véridiques et exactes. Nous nous réservons le droit de réviser, modifier ou supprimer toute annonce inexacte, trompeuse ou non conforme. La durée d'affichage des annonces dépend du plan d'abonnement choisi."
            },
            {
                heading: "4. Frais et paiements",
                content: "Nous proposons divers plans d'abonnement avec des frais clairement indiqués au moment de l'achat. Tous les frais sont non remboursables. Nous nous réservons le droit de modifier nos tarifs, mais les abonnements déjà achetés ne seront pas affectés."
            },
            {
                heading: "5. Avis de non-responsabilité",
                content: "MAQC n'est pas un courtier immobilier, ne fournit pas de conseils d'achat ou de vente et ne participe pas aux négociations ou transactions. Nous ne sommes pas responsables de l'exactitude des annonces, des résultats des transactions ou des actions de tiers. Les utilisateurs doivent faire preuve de jugement et assument les risques liés aux transactions."
            },
            {
                heading: "6. Propriété intellectuelle",
                content: "Tout le contenu de la plateforme, y compris les textes, graphiques, logos, logiciels et conceptions, est protégé par les lois sur la propriété intellectuelle. Il est interdit de copier, modifier, distribuer ou utiliser à des fins commerciales sans autorisation."
            },
            {
                heading: "7. Protection de la vie privée",
                content: "Nous respectons la vie privée de nos utilisateurs. Les informations collectées sont utilisées uniquement pour fournir et améliorer nos services. Veuillez consulter notre politique de confidentialité pour plus de détails."
            },
            {
                heading: "8. Modifications et résiliation",
                content: "Nous nous réservons le droit de modifier ou de résilier nos services à tout moment. Nous pouvons suspendre ou résilier les comptes qui violent ces conditions, sans préavis."
            },
            {
                heading: "9. Droit applicable",
                content: "Ces conditions sont régies par les lois de la province de Québec, Canada. Tout différend sera soumis aux tribunaux de la province de Québec."
            },
            {
                heading: "10. Contact",
                content: "Pour toute question, veuillez nous contacter :\nCourriel : info@maqc.ca"
            }
        ]
    }
};

export const privacyContent = {
    zh: {
        title: "隐私政策",
        lastUpdated: "2024年1月1日",
        sections: [
            {
                heading: "1. 信息收集",
                content: "我们收集以下类型的信息：\n\n个人信息：姓名、电子邮件地址、电话号码等您主动提供的联系方式。\n使用信息：访问记录、浏览历史、搜索查询等技术数据。\n设备信息：IP地址、浏览器类型、操作系统等。"
            },
            {
                heading: "2. 信息使用",
                content: "我们使用收集的信息用于：\n\n• 提供和维护平台服务\n• 处理您的房源发布请求\n• 发送服务相关通知\n• 改进用户体验\n• 防止欺诈和滥用"
            },
            {
                heading: "3. 信息共享",
                content: "我们不会出售您的个人信息。我们仅在以下情况下共享信息：\n\n• 房源信息中的联系方式（经您授权）\n• 服务提供商（如支付处理、云存储）\n• 法律要求的情况"
            },
            {
                heading: "4. 数据安全",
                content: "我们采取行业标准的安全措施保护您的数据：\n\n• SSL加密传输\n• 密码加密存储\n• 访问权限控制\n• 定期安全审计"
            },
            {
                heading: "5. Cookie使用",
                content: "本网站使用Cookie用于：\n\n• 保持登录状态\n• 记住语言偏好\n• 分析网站流量\n\n您可以通过浏览器设置管理Cookie。"
            },
            {
                heading: "6. 您的权利",
                content: "您有权：\n\n• 访问和更新您的个人信息\n• 删除您的账户和数据\n• 拒绝营销通信\n• 向监管机构投诉"
            },
            {
                heading: "7. 联系我们",
                content: "如有隐私相关问题，请联系：\n\n电子邮件：privacy@maqc.ca"
            }
        ]
    },
    fr: {
        title: "Politique de confidentialité",
        lastUpdated: "1er janvier 2024",
        sections: [
            {
                heading: "1. Collecte des informations",
                content: "Nous collectons les types d'informations suivants :\n\nInformations personnelles : nom, adresse e-mail, numéro de téléphone et autres coordonnées que vous fournissez volontairement.\nInformations d'utilisation : données techniques telles que les historiques de visite, l'historique de navigation et les requêtes de recherche.\nInformations sur l'appareil : adresse IP, type de navigateur, système d'exploitation, etc."
            },
            {
                heading: "2. Utilisation des informations",
                content: "Nous utilisons les informations collectées pour :\n\n• Fournir et maintenir les services de la plateforme\n• Traiter vos demandes de publication d'annonces\n• Envoyer des notifications liées aux services\n• Améliorer l'expérience utilisateur\n• Prévenir la fraude et les abus"
            },
            {
                heading: "3. Partage des informations",
                content: "Nous ne vendons pas vos informations personnelles. Nous ne partageons des informations que dans les cas suivants :\n\n• Coordonnées dans les annonces (avec votre autorisation)\n• Fournisseurs de services (paiement, stockage cloud, etc.)\n• Lorsque la loi l'exige"
            },
            {
                heading: "4. Sécurité des données",
                content: "Nous mettons en œuvre des mesures de sécurité standard de l'industrie pour protéger vos données :\n\n• Chiffrement SSL pour les transmissions\n• Stockage chiffré des mots de passe\n• Contrôle d'accès basé sur les rôles\n• Audits de sécurité réguliers"
            },
            {
                heading: "5. Utilisation des cookies",
                content: "Notre site web utilise des cookies pour :\n\n• Maintenir la session de connexion\n• Mémoriser les préférences linguistiques\n• Analyser le trafic du site\n\nVous pouvez gérer les cookies via les paramètres de votre navigateur."
            },
            {
                heading: "6. Vos droits",
                content: "Vous avez le droit de :\n\n• Accéder et mettre à jour vos informations personnelles\n• Supprimer votre compte et vos données\n• Refuser les communications marketing\n• Porter plainte auprès des autorités de régulation"
            },
            {
                heading: "7. Contact",
                content: "Pour toute question concernant la confidentialité, veuillez contacter :\n\nCourriel : privacy@maqc.ca"
            }
        ]
    }
};
